# BasicEcommerce

Platforma e-commerce w PHP z nowoczesnym Bootstrap 5.

---

## Spis Treści

1. [Wprowadzenie](#wprowadzenie)
2. [Funkcjonalności](#funkcjonalności)
3. [Wymagania Systemowe](#wymagania-systemowe)
4. [Instalacja](#instalacja)
5. [Konfiguracja](#konfiguracja)
6. [Architektura Aplikacji](#architektura-aplikacji)
7. [Schemat Bazy Danych](#schemat-bazy-danych)
8. [Dokumentacja API](#dokumentacja-api)
9. [Przewodnik Użytkownika](#przewodnik-użytkownika)
10. [Przewodnik Administratora](#przewodnik-administratora)
11. [Struktura Katalogów](#struktura-katalogów)
12. [Bezpieczeństwo](#bezpieczeństwo)

---

## Wprowadzenie

BasicEcommerce to lekkie, ale rozbudowane rozwiązanie e-commerce zbudowane w czystym PHP zgodnie z wzorcem architektonicznym MVC (Model-View-Controller). Aplikacja zapewnia wszystkie niezbędne funkcje do prowadzenia sklepu internetowego, w tym:

- Katalog produktów z kategoriami i wariantami (rozmiarami)
- Koszyk zakupowy (oparty na sesji dla gości, zapisywany w bazie dla zalogowanych)
- Rejestracja i uwierzytelnianie użytkowników
- System zarządzania zamówieniami
- Panel administracyjny do zarządzania sklepem
- Powiadomienia e-mail przez PHPMailer
- Responsywny design z Bootstrap 5

---

## Funkcjonalności

### Funkcje dla Klientów
- **Przeglądanie Produktów**: Filtrowanie po kategorii, rozmiarze i zakresie cenowym
- **Szczegóły Produktu**: Wyświetlanie opisów, zdjęć i dostępnych wariantów
- **Koszyk Zakupowy**: Dodawanie/usuwanie produktów, zmiana ilości (działa dla gości i zarejestrowanych użytkowników)
- **Konto Użytkownika**: Rejestracja, logowanie, zarządzanie profilem, historia zamówień
- **Reset Hasła**: Bezpieczne odzyskiwanie hasła przez e-mail
- **Składanie Zamówień**: Finalizacja zakupu z danymi do wysyłki
- **Artykuły/Blog**: Czytanie artykułów sklepu (FAQ, polityka wysyłki, zwroty itp.)

### Funkcje dla Administratorów
- **Dashboard**: Przegląd statystyk sklepu
- **Zarządzanie Produktami**: Tworzenie, edycja, usuwanie produktów ze zdjęciami i wariantami
- **Zarządzanie Kategoriami**: Organizacja produktów w kategorie
- **Zarządzanie Wariantami**: Definiowanie rozmiarów produktów (S, M, L, XL, One Size itp.)
- **Zarządzanie Zamówieniami**: Przeglądanie i aktualizacja statusów zamówień
- **Zarządzanie Użytkownikami**: Przeglądanie, edycja i zarządzanie kontami klientów
- **Zarządzanie Artykułami**: Tworzenie i publikowanie artykułów sklepu
- **Konfiguracja**: Aktualizacja ustawień sklepu (cena wysyłki, banery itp.)

---

## Wymagania Systemowe

- **PHP**: 8.0 lub wyższy
- **MySQL**: 5.7 lub wyższy / MariaDB 10.3+
- **Serwer WWW**: Apache z mod_rewrite lub Nginx
- **Rozszerzenia**: PDO, PDO_MySQL, OpenSSL (dla e-maili)

---

## Instalacja

### 1. Sklonuj Repozytorium
```bash
git clone <adres-repozytorium>
cd BasicEcommerce
```

### 2. Skonfiguruj Serwer WWW
Ustaw katalog główny serwera na katalog `public/`.

**Apache (plik .htaccess już dołączony)**:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
```

### 3. Utwórz Bazę Danych
```sql
CREATE DATABASE ecommerce;
USE ecommerce;
```

### 4. Zaimportuj Schemat Bazy Danych
```bash
mysql -u twoj_uzytkownik -p ecommerce < app/Database/ecommerce.sql
```

### 5. Skonfiguruj Aplikację
Edytuj plik `app/Core/config.php` wprowadzając swoje ustawienia (zobacz [Konfiguracja](#konfiguracja)).

---

## Konfiguracja

Edytuj plik `app/Core/config.php`:

```php
<?php
return [
    'db' => [
        'host' => 'localhost',        // Host bazy danych
        'name' => 'ecommerce',        // Nazwa bazy danych
        'user' => 'root',             // Użytkownik bazy danych
        'pass' => 'twoje_haslo'       // Hasło do bazy danych
    ],
    'phpmailer' => [
        'smtp_host'        => 'smtp.gmail.com',    // Serwer SMTP
        'smtp_port'        => 587,                  // Port SMTP
        'smtp_secure'      => 'tls',                // Szyfrowanie (tls/ssl)
        'smtp_username'    => 'twoj@email.com',     // Nazwa użytkownika SMTP
        'smtp_password'    => 'haslo_aplikacji',    // Hasło SMTP
        'mail_from'        => 'twoj@email.com',     // Adres nadawcy
        'mail_from_name'   => 'Nazwa Sklepu'        // Nazwa nadawcy
    ]
];
```

### Konfiguracja Bazy Danych (`shipping_price`)
Cena wysyłki jest przechowywana w tabeli `Configuration`. Domyślna wartość to `22.0`.

---

## Architektura Aplikacji

### Wzorzec MVC

```
┌─────────────────────────────────────────────────────────────┐
│                     Przepływ Żądania                         │
├─────────────────────────────────────────────────────────────┤
│  Żądanie z Przeglądarki                                      │
│       ↓                                                      │
│  public/index.php (Punkt Wejścia)                            │
│       ↓                                                      │
│  Router (app/Core/Router.php)                                │
│       ↓                                                      │
│  Middleware (Uwierzytelnianie itp.)                          │
│       ↓                                                      │
│  Kontroler (app/Controllers/*.php)                           │
│       ↓                                                      │
│  Model (app/Models/*.php) ←→ Baza Danych                     │
│       ↓                                                      │
│  Widok (app/Views/*.html) + LayoutEngine                     │
│       ↓                                                      │
│  Odpowiedź HTTP                                              │
└─────────────────────────────────────────────────────────────┘
```

### Komponenty Główne

| Komponent | Lokalizacja | Opis |
|-----------|-------------|------|
| **Router** | `app/Core/Router.php` | Obsługuje routing URL z ekstrakcją parametrów |
| **Request** | `app/Core/Request.php` | Enkapsuluje dane żądania HTTP (GET, POST, JSON, pliki) |
| **Database** | `app/Core/Database.php` | Singleton PDO do połączeń z bazą danych |
| **LayoutEngine** | `app/Core/LayoutEngine.php` | Silnik szablonów z sekcjami i rozszerzeniami |
| **Mailer** | `app/Core/Mailer.php` | Wysyłanie e-maili przez PHPMailer |

### System Middleware

Klasy middleware przechwytują żądania zanim dotrą do kontrolerów:

| Middleware | Przeznaczenie |
|------------|---------------|
| `UserAuthMiddleware` | Wymaga zalogowanego użytkownika, przekierowuje na `/login` |
| `AdminAuthMiddleware` | Wymaga roli ADMIN lub SUPERADMIN |
| `APIUserAuthMiddleware` | Waliduje sesję użytkownika dla wywołań API |
| `APIAdminAuthMiddleware` | Waliduje sesję admina dla wywołań API |
| `AdminTopbarMiddleware` | Dodaje pasek narzędzi admina dla zalogowanych administratorów |

---

## Schemat Bazy Danych

### Diagram Związków Encji

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Category   │       │   Product    │       │    Photo     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ category_id  │←──────│ category_id  │──────→│ product_id   │
│ name         │       │ product_id   │←──┐   │ photo_id     │
└──────────────┘       │ name         │   │   │ filename     │
                       │ description  │   │   │ order_number │
                       │ price        │   │   └──────────────┘
                       │ visible      │   │
                       └──────────────┘   │
                              ↑           │
                              │           │
┌──────────────┐       ┌──────────────────┴───┐       ┌────────────────┐
│   Variant    │       │   Product_Variant    │       │  Order_Detail  │
├──────────────┤       ├──────────────────────┤       ├────────────────┤
│ variant_id   │←──────│ variant_id           │       │ order_detail_id│
│ name         │       │ product_variant_id   │──────→│ prod_variant_id│
└──────────────┘       │ product_id           │       │ order_id       │──┐
                       │ quantity             │       │ quantity       │  │
                       │ width                │       └────────────────┘  │
                       │ height               │                           │
                       └──────────────────────┘                           │
                              ↑                                           │
                              │ (tymczasowe przech. koszyka)              │
                       ┌──────────────────────┐       ┌───────────────────┴─┐
                       │     Cart_Entry       │       │       Order         │
                       ├──────────────────────┤       ├─────────────────────┤
                       │ cart_entry_id        │       │ order_id            │
                       │ user_id              │──┐    │ user_id             │──┐
                       │ product_variant_id   │  │    │ fullname            │  │
                       │ quantity             │  │    │ email               │  │
                       └──────────────────────┘  │    │ phone_number        │  │
                                                 │    │ address, city, etc. │  │
                                                 │    │ shipping_price      │  │
┌──────────────┐                                 │    │ products_price      │  │
│   Article    │                                 │    │ payment_method      │  │
├──────────────┤                                 │    │ status              │  │
│ article_id   │                                 │    └─────────────────────┘  │
│ title        │                                 │                             │
│ public       │                                 │                             │
│ date         │       ┌──────────────┐          │                             │
│ content      │       │    User      │←─────────┴─────────────────────────────┘
└──────────────┘       ├──────────────┤
                       │ user_id      │
                       │ firstname    │
┌──────────────┐       │ lastname     │
│Password_Reset│       │ email        │
├──────────────┤       │ password     │
│ reset_id     │──────→│ phone_number │
│ user_id      │       │ address      │
└──────────────┘       │ type (ENUM)  │
                       └──────────────┘


                    ┌─────────────────────────────────────────┐
                    │           Configuration                 │
                    ├─────────────────────────────────────────┤
                    │ configuration_id (np. "shipping_price") │
                    │ value                                   │
                    └─────────────────────────────────────────┘
```

### Opis Tabel

| Tabela | Opis |
|--------|------|
| `User` | Użytkownicy sklepu z rolami: CUSTOMER, ADMIN, SUPERADMIN |
| `Product` | Produkty z nazwą, opisem, ceną, widocznością |
| `Category` | Kategorie produktów (tops, bottoms, footwear, accessories) |
| `Variant` | Warianty rozmiaru (S, M, L, XL, One Size) |
| `Product_Variant` | Łączy produkty z wariantami wraz z ilością, szerokością, wysokością |
| `Photo` | Zdjęcia produktów z kolejnością wyświetlania |
| `Cart_Entry` | Pozycje koszyka dla zalogowanych użytkowników |
| `Order` | Zamówienia klientów z danymi wysyłki i płatności |
| `Order_Detail` | Produkty w każdym zamówieniu |
| `Article` | Artykuły bloga/informacyjne (FAQ, Regulamin itp.) |
| `Password_Reset` | Tokeny resetowania hasła |
| `Configuration` | Ustawienia sklepu (klucz-wartość) |
| `ProductsList` | Widok łączący dane produktów i wariantów |

### Role Użytkowników

| Rola | Uprawnienia |
|------|-------------|
| `CUSTOMER` | Przeglądanie produktów, zarządzanie koszykiem, składanie zamówień, zarządzanie kontem |
| `ADMIN` | Wszystkie uprawnienia klienta + dostęp do panelu admina |
| `SUPERADMIN` | Wszystkie uprawnienia admina + zarządzanie rolami użytkowników |

---

## Dokumentacja API

### Publiczne Endpointy API

#### Produkty
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/products/load` | Pobierz przefiltrowaną listę produktów |
| POST | `/product/load/{id}` | Pobierz szczegóły pojedynczego produktu |
| POST | `/product/load/variant/{variantid}` | Pobierz produkt po ID wariantu |
| POST | `/products/pages` | Pobierz informacje o paginacji |

**Treść żądania dla `/products/load`:**
```json
{
  "categories": [1, 2],
  "sizes": [1, 2, 3],
  "price_from": 50,
  "price_to": 200,
  "limit": 8,
  "page": 1
}
```

#### Kategorie i Warianty
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/categories/load` | Pobierz wszystkie kategorie |
| POST | `/variants/load` | Pobierz wszystkie warianty |

#### Artykuły
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/articles/load` | Pobierz opublikowane artykuły |
| POST | `/article/load/{id}` | Pobierz pojedynczy artykuł |
| POST | `/articles/pages` | Pobierz informacje o paginacji |

#### Koszyk
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/cart/size` | Pobierz liczbę produktów w koszyku |
| POST | `/cart/add` | Dodaj produkt do koszyka |
| POST | `/cart/delete/{index}` | Usuń produkt z koszyka |
| POST | `/cart/change/{index}` | Zmień ilość produktu |
| POST | `/cart/load` | Pobierz zawartość koszyka |

**Treść żądania dla `/cart/add`:**
```json
{
  "product_variant_id": 5
}
```

#### Uwierzytelnianie Użytkowników
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/user/login` | Zaloguj użytkownika |
| POST | `/user/register` | Zarejestruj nowego użytkownika |
| POST | `/user/logout` | Wyloguj użytkownika |
| POST | `/user/load` | Pobierz dane bieżącego użytkownika |
| POST | `/user/reset/setup` | Żądanie resetu hasła |
| POST | `/user/reset/try` | Zakończ reset hasła |

**Treść żądania dla `/user/login`:**
```json
{
  "email": "uzytkownik@example.com",
  "password": "haslo123"
}
```

**Treść żądania dla `/user/register`:**
```json
{
  "firstname": "Jan",
  "lastname": "Kowalski",
  "email": "jan@example.com",
  "password": "bezpieczne_haslo",
  "phone_number": "+48123456789",
  "address": "ul. Główna 123",
  "building": "4A",
  "city": "Warszawa",
  "post_code": "00-001",
  "country": "Polska"
}
```

#### Zamówienia
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/order/new` | Złóż nowe zamówienie |
| POST | `/order/load/{id}` | Pobierz szczegóły zamówienia |

### Chronione Endpointy API (Wymagane Uwierzytelnienie Użytkownika)

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/user/update/data` | Zaktualizuj profil użytkownika |
| POST | `/user/update/password` | Zmień hasło |
| POST | `/user/orders/load` | Pobierz zamówienia użytkownika |

### Endpointy API Administratora (Wymagane Uwierzytelnienie Admina)

#### Zarządzanie Produktami
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/product/new` | Utwórz produkt |
| POST | `/product/delete/{id}` | Usuń produkt |
| POST | `/product/edit/desc/{productid}` | Zaktualizuj opis |
| POST | `/product/edit/info/{productid}` | Zaktualizuj informacje o produkcie |
| POST | `/product/photo/new` | Prześlij zdjęcie |
| POST | `/product/photo/delete/{id}` | Usuń zdjęcie |
| POST | `/product/photos/reorder/{productid}` | Zmień kolejność zdjęć |
| POST | `/product/variant/new` | Dodaj wariant produktu |
| POST | `/product/variant/edit/{id}` | Edytuj wariant produktu |
| POST | `/product/variant/delete/{id}` | Usuń wariant produktu |
| POST | `/products/list` | Pobierz wszystkie produkty (widok admina) |

#### Zarządzanie Kategoriami i Wariantami
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/category/new` | Utwórz kategorię |
| POST | `/category/edit/{id}` | Edytuj kategorię |
| POST | `/category/delete/{id}` | Usuń kategorię |
| POST | `/variant/new` | Utwórz wariant |
| POST | `/variant/edit/{id}` | Edytuj wariant |
| POST | `/variant/delete/{id}` | Usuń wariant |

#### Zarządzanie Zamówieniami
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/orders/list` | Pobierz wszystkie zamówienia |
| POST | `/order/edit/status/{orderid}` | Zaktualizuj status zamówienia |

#### Zarządzanie Użytkownikami
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/users/list` | Pobierz wszystkich użytkowników |
| POST | `/user/update/data/{userid}` | Zaktualizuj dane użytkownika (admin) |
| POST | `/user/update/password/{userid}` | Zresetuj hasło użytkownika |
| POST | `/user/update/type/{userid}` | Zmień rolę użytkownika |
| POST | `/user/delete/{userid}` | Usuń użytkownika |

#### Zarządzanie Artykułami
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/article/new` | Utwórz artykuł |
| POST | `/article/delete/{id}` | Usuń artykuł |
| POST | `/article/edit/content/{articleid}` | Zaktualizuj treść |
| POST | `/article/edit/info/{articleid}` | Zaktualizuj informacje o artykule |
| POST | `/articles/list` | Pobierz wszystkie artykuły |

#### Konfiguracja
| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/configuration/list` | Pobierz wszystkie ustawienia |
| POST | `/configuration/update/{configid}` | Zaktualizuj ustawienie |
| POST | `/configuration/banner/set` | Zaktualizuj obraz banera |

---

## Przewodnik Użytkownika

### Przeglądanie Produktów
1. Przejdź do **PRODUCTS** z menu głównego
2. Użyj panelu filtrów, aby zawęzić wyniki według:
   - Kategorii (Tops, Bottoms, Footwear, Accessories)
   - Rozmiaru (S, M, L, XL, One Size)
   - Zakresu cenowego
3. Kliknij na produkt, aby zobaczyć szczegóły

### Koszyk Zakupowy
1. Na stronie produktu wybierz wariant (rozmiar)
2. Kliknij **Add to Cart** (Dodaj do koszyka)
3. Przejdź do koszyka klikając ikonę torby w nagłówku
4. Dostosuj ilości lub usuń produkty
5. Przejdź do finalizacji zamówienia

### Konto Użytkownika
1. Kliknij **ACCOUNT**, aby się zarejestrować lub zalogować
2. Po zalogowaniu uzyskasz dostęp do:
   - Zarządzania profilem
   - Historii zamówień
   - Zmiany hasła

### Składanie Zamówienia
1. Z koszyka kliknij **Checkout** (Finalizuj)
2. Wypełnij dane osobowe i adres dostawy
3. Potwierdź zamówienie
4. Otrzymasz e-mail z potwierdzeniem

---

## Przewodnik Administratora

### Dostęp do Panelu Administracyjnego
1. Zaloguj się na konto ADMIN lub SUPERADMIN
2. Przejdź do `/admin`
3. Lub użyj paska narzędzi admina, który pojawia się u góry stron

### Zarządzanie Produktami
1. Przejdź do **Products** w panelu admina
2. **Dodaj Produkt**: Wypełnij nazwę, kategorię, cenę, widoczność
3. **Edytuj Produkt**: Kliknij wiersz produktu, aby uzyskać dostęp do:
   - Podstawowych informacji (nazwa, cena, kategoria, widoczność)
   - Opisu (edytor HTML)
   - Zdjęć (przesyłanie, zmiana kolejności, usuwanie)
   - Wariantów (dodawanie rozmiarów ze stanem magazynowym i wymiarami)

### Zarządzanie Zamówieniami
1. Przejdź do **Orders** w panelu admina
2. Przeglądaj wszystkie zamówienia posortowane według statusu
3. Aktualizuj status zamówienia:
   - PENDING → PAID → PREPARING → SHIPPED
   - Lub CANCELED
4. Klient otrzymuje e-mail przy zmianie statusu

### Zarządzanie Użytkownikami
1. Przejdź do **Users** w panelu admina
2. Przeglądaj administratorów na górze, klientów poniżej
3. Edytuj dane użytkowników, resetuj hasła
4. Zmieniaj role użytkowników (tylko SUPERADMIN)
5. Usuwaj użytkowników (wysyła e-mail z powiadomieniem)

### Zarządzanie Kategoriami i Wariantami
1. Dostęp przez menu boczne panelu admina
2. Dodawaj/edytuj/usuwaj kategorie i warianty rozmiarów
3. Uwaga: Nie można usunąć, jeśli przypisane są produkty

---

## Struktura Katalogów

```
BasicEcommerce/
├── app/
│   ├── Controllers/           # Obsługa żądań
│   │   ├── AdminController.php
│   │   ├── ArticleController.php
│   │   ├── CartController.php
│   │   ├── CategoryController.php
│   │   ├── ConfigurationController.php
│   │   ├── ErrorController.php
│   │   ├── HomeController.php
│   │   ├── OrderController.php
│   │   ├── ProductController.php
│   │   ├── UserController.php
│   │   └── VariantController.php
│   │
│   ├── Core/                  # Rdzeń frameworka
│   │   ├── config.php         # Plik konfiguracyjny
│   │   ├── Database.php       # Singleton PDO
│   │   ├── LayoutEngine.php   # Silnik szablonów
│   │   ├── Mailer.php         # Serwis e-mail
│   │   ├── Request.php        # Wrapper żądania HTTP
│   │   ├── Router.php         # Routing URL
│   │   └── Utilities.php      # Funkcje pomocnicze
│   │
│   ├── Database/
│   │   └── ecommerce.sql      # Schemat bazy danych i dane początkowe
│   │
│   ├── Frameworks/
│   │   └── PHPMailer/         # Biblioteka e-mail
│   │
│   ├── MailTemplates/         # Szablony HTML e-maili
│   │   ├── general.html
│   │   ├── orderConfirmation.html
│   │   ├── orderStatusChange.html
│   │   ├── passwordChange.html
│   │   └── registerWelcome.html
│   │
│   ├── Middleware/            # Filtry żądań
│   │   ├── AdminAuthMiddleware.php
│   │   ├── AdminTopbarMiddleware.php
│   │   ├── APIAdminAuthMiddleware.php
│   │   ├── APIUserAuthMiddleware.php
│   │   └── UserAuthMiddleware.php
│   │
│   ├── Models/                # Warstwa dostępu do danych
│   │   ├── Article.php
│   │   ├── Cart_Entry.php
│   │   ├── Category.php
│   │   ├── Configuration.php
│   │   ├── Order.php
│   │   ├── Photo.php
│   │   ├── Product.php
│   │   ├── User.php
│   │   └── Variant.php
│   │
│   ├── Routes/                # Definicje tras
│   │   ├── admin.php          # Trasy admina
│   │   ├── api.php            # Publiczne trasy API
│   │   └── web.php            # Trasy frontendowe
│   │
│   └── Views/                 # Szablony HTML
│       ├── Admin/             # Widoki panelu admina
│       ├── Errors/            # Strony błędów
│       ├── LayoutExtensions/  # Komponenty wielokrotnego użytku
│       ├── layout.html        # Główny layout
│       └── *.html             # Szablony stron
│
└── public/                    # Katalog główny WWW (document root)
    ├── index.php              # Punkt wejścia
    ├── assets/                # Zasoby statyczne
    │   ├── graphics/          # Obrazy strony
    │   ├── icons/             # Pliki ikon
    │   └── products/          # Zdjęcia produktów
    ├── css/                   # Arkusze stylów
    │   └── admin/             # Style admina
    ├── frameworks/            # Biblioteki frontendowe
    │   ├── bootstrap-5.3.8-dist/
    │   └── jquery-3.7.1.min.js
    └── js/                    # Pliki JavaScript
        └── admin/             # Skrypty admina
```

---

## Bezpieczeństwo

### Obsługa Haseł
- Hasła hashowane przy użyciu `password_hash()` z `PASSWORD_DEFAULT` (bcrypt)
- Weryfikacja hasła przez `password_verify()`

### Zarządzanie Sesjami
- Natywne sesje PHP
- Dane sesji przechowywane po stronie serwera
- Informacje o użytkowniku w `$_SESSION['user']`

### Uwierzytelnianie
- Ochrona tras oparta na middleware
- Kontrola dostępu oparta na rolach (CUSTOMER, ADMIN, SUPERADMIN)
- Endpointy API chronione przez walidację sesji

### Walidacja Danych Wejściowych
- Przygotowane zapytania PDO zapobiegają SQL injection
- Parsowanie żądań JSON dla endpointów API
- Walidacja formatu e-mail na poziomie bazy danych

### Zalecenia dla Produkcji
1. Włącz HTTPS
2. Ustaw bezpieczne ciasteczka sesji
3. Zaimplementuj ochronę CSRF
4. Dodaj ograniczenie częstotliwości żądań (rate limiting)
5. Sanityzuj zawartość HTML (zapobieganie XSS)
6. Regularne aktualizacje bezpieczeństwa

---

## Domyślne Konta Testowe

| E-mail | Hasło | Rola |
|--------|-------|------|
| alice@example.com | test1234 | CUSTOMER |
| harmonixxgames@gmail.com | test1234 | SUPERADMIN |
| kacper@example.com | test1234 | ADMIN |

---

## Licencja

Ten projekt jest udostępniony w celach edukacyjnych.

---

