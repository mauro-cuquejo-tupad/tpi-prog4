import pytest

def login(client, email, password):
    return client.post("/api/v1/auth/token", data={"username": email, "password": password})

def test_registro_usuario(client):
    r = client.post("/api/v1/auth/register", json={
        "nombre": "Carlos",
        "apellido": "Lopez",
        "email": "carlos@test.com",
        "password": "Password123!"
    })
    assert r.status_code == 201
    data = r.json()
    assert data["email"] == "carlos@test.com"
    assert "roles" in data
    assert "user" in data["roles"]
    assert "password_hash" not in data

def test_registro_email_duplicado_da_409(client):
    r = client.post("/api/v1/auth/register", json={
        "nombre": "Juan",
        "apellido": "Repetido",
        "email": "juan@test.com",
        "password": "Password123!"
    })
    assert r.status_code == 409

def test_registro_password_corta_da_422(client):
    r = client.post("/api/v1/auth/register", json={
        "nombre": "Ana",
        "apellido": "Corta",
        "email": "ana@test.com",
        "password": "123"
    })
    assert r.status_code == 422

def test_login_exitoso_y_cookie_httponly(client):
    r = login(client, "juan@test.com", "Juan1234!")
    assert r.status_code == 200
    assert "access_token" in client.cookies

def test_login_credenciales_invalidas_da_401(client):
    r = login(client, "juan@test.com", "WrongPassword!")
    assert r.status_code == 401

def test_me_sin_cookie_da_401(client):
    r = client.get("/api/v1/auth/me")
    assert r.status_code == 401

def test_me_con_cookie_valida(client):
    login(client, "juan@test.com", "Juan1234!")
    r = client.get("/api/v1/auth/me")
    assert r.status_code == 200
    assert r.json()["email"] == "juan@test.com"
    assert "user" in r.json()["roles"]

def test_encabezado_authorization_no_se_acepta(client):
    token = login(client, "juan@test.com", "Juan1234!").cookies.get("access_token")
    client.cookies.clear()
    r = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 401

def test_logout_borra_cookie(client):
    login(client, "juan@test.com", "Juan1234!")
    r = client.post("/api/v1/auth/logout")
    assert r.status_code == 200
    assert client.cookies.get("access_token") is None

def test_usuario_comun_en_ruta_admin_da_403(client):
    login(client, "juan@test.com", "Juan1234!")
    r = client.get("/api/v1/auth/admin/usuarios")
    assert r.status_code == 403

def test_admin_en_ruta_admin_da_200(client):
    login(client, "admin@test.com", "Admin1234!")
    r = client.get("/api/v1/auth/admin/usuarios")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_admin_desactivar_y_activar_usuario(client):
    login(client, "admin@test.com", "Admin1234!")
    usuarios = client.get("/api/v1/auth/admin/usuarios").json()
    juan = next(u for u in usuarios if u["email"] == "juan@test.com")
    
    # Desactivar
    r_des = client.post(f"/api/v1/auth/admin/usuarios/{juan['id']}/desactivar")
    assert r_des.status_code == 200
    assert r_des.json()["deleted_at"] is not None

    # Intentar login con cuenta desactivada
    client.cookies.clear()
    r_log = login(client, "juan@test.com", "Juan1234!")
    assert r_log.status_code == 400
    assert r_log.json()["detail"] == "Cuenta de usuario desactivada"

    # Reactivar
    login(client, "admin@test.com", "Admin1234!")
    r_act = client.post(f"/api/v1/auth/admin/usuarios/{juan['id']}/activar")
    assert r_act.status_code == 200
    assert r_act.json()["deleted_at"] is None

def test_rbac_escritura_categorias_y_productos(client):
    # Sin auth -> 401
    client.cookies.clear()
    assert client.post("/categorias/", json={"nombre": "Postres", "descripcion": "Dulces"}).status_code == 401
    
    # Como user -> 403 en POST
    login(client, "juan@test.com", "Juan1234!")
    assert client.post("/categorias/", json={"nombre": "Postres", "descripcion": "Dulces"}).status_code == 403
    assert client.post("/productos/", json={"nombre": "Tarta", "descripcion": "De frutilla", "precio_base": 5000.0}).status_code == 403
    # Pero GET lectura permitido -> 200
    assert client.get("/categorias/").status_code == 200
    assert client.get("/productos/").status_code == 200

    # Como admin -> 201 en POST
    login(client, "admin@test.com", "Admin1234!")
    r_cat = client.post("/categorias/", json={"nombre": "Postres", "descripcion": "Dulces"})
    assert r_cat.status_code == 201
    cat_id = r_cat.json()["id"]

    # Borrado lógico: DELETE responde 204
    r_del = client.delete(f"/categorias/{cat_id}")
    assert r_del.status_code == 204
    # No aparece en el listado
    cats = client.get("/categorias/").json()
    assert all(c["id"] != cat_id for c in cats)
