# Node Manager

**Node Manager** je samostatná backendová + frontendová webová aplikace sloužící ke konfiguraci zavlažovacích nodů pro projekt **Smart Irrigation System (SIS)**.

Projekt je primárně:
- **cvičný / demonstrační backend projekt** (junior → medior level),
- zároveň **praktický konfigurační nástroj** pro reálný IoT systém.

Node Manager není runtime součástí SIS – slouží výhradně k návrhu, validaci, ukládání a exportu konfigurací, které jsou následně nahrány do SIS serveru nebo přímo na node.

---

## High-level cíl projektu

Cílem Node Manageru je:
- nahradit ruční editaci JSON konfigurací,
- poskytnout strukturované REST API pro správu:
  - nodů
  - zavlažovacích zón
  - jejich parametrů
- generovat **validní konfigurační soubory**, které odpovídají architektuře SIS.

Projekt je navržen jako **nearly-production-grade backend aplikace**, se zaměřením na:
- clean architecture
- separation of concerns
- čitelnost a rozšiřitelnost
- testovatelnost

---

## Vztah k projektu Smart Irrigation System (SIS)

**Smart Irrigation System (SIS)** je distribuovaný IoT systém:

- **Edge Node** (Raspberry Pi Zero 2 W)
  - lokální autonomní řízení zavlažování
  - multithreading, fail-safe logika
  - práce s počasím, fallback strategie
- **Central Server**
  - MQTT komunikace s nody
  - REST API
  - monitoring
- **Web UI**
  - přehled stavu nodů a zón
  - vizualizace spotřeby vody

👉 **Node Manager není součástí runtime architektury SIS**  
👉 Slouží pouze k **přípravě konfigurace**

---

## Architektura Node Manageru

### Backend (hlavní fokus projektu)

Backend je navržen jako klasická REST API aplikace:

- **FastAPI**
- **SQLModel (SQLAlchemy + Pydantic)**
- **SQLite** (MVP)
- Clean Architecture styl

#### Logické vrstvy:

routers/ – HTTP / REST API vrstrva
services/ – aplikační a business logika
repositories/ – perzistence a DB přístup
models/ – SQLModel entity (DB reprezentace)
schemas/ – Pydantic schémata (API kontrakty)
core/ – konfigurace aplikace, session, app setup


---

### Frontend (MVP)

- **React**
- **Chakra UI**
- Wizard-style UI

Frontend není cílem projektu z hlediska hloubky – slouží hlavně jako:
- demonstrace práce s API
- nástroj pro konfiguraci

---

## Základní doménové pojmy

### Node

Node reprezentuje **jeden fyzický zavlažovací uzel** (např. skleník, zahrada).

Node obsahuje:
- identitu a metadata
- hardware konfiguraci
- výchozí limity a strategie
- kolekci zavlažovacích zón

### Zone

Zone reprezentuje **jeden zavlažovací okruh** (relay / ventil).

Zone:
- má přesně jeden parent Node
- definuje:
  - jakým způsobem se má zavlažovat
  - kolik vody
  - kdy
  - jak se má chovat při chybách

---

## Konfigurační výstupy

Node Manager generuje **dva typy konfiguračních souborů**:

---

### `system_config.json`

Globální konfigurace systému – **nezávislá na jednotlivých nodech**.

Obsahuje např.:
- referenční meteorologické podmínky
- korekční faktory
- konfiguraci weather API
- výchozí hodnoty pro nové nody

Používá ji:
- SIS server
- nepřímo i nody (přes server)

---

### `node_X_config.json`

Konfigurace **jednoho konkrétního nodu**.

Obsahuje:
- metadata nodu
- hardware konfiguraci
- lokální limity
- seznam zón

Každý node má **vlastní config soubor**.

---

## Irrigation modes (zásadní koncept)

Každá zóna pracuje v jednom z režimů:

### `even_area`
- zavlažování rovnoměrně podle plochy
- zavlažovaná plocha je rovnoměrně pokryta zavlažovacími emitory
- vstupy:
  - `zone_area_m2`
  - `target_mm`
- výsledkem je vypočtený základní objem vody

### `per_plant`
- zavlažování podle potřeb rostlin
- zavlažovaná plocha je pokryta rostlinami s různými potřebami vody, případně samostatné květináče
- vstup:
  - `base_target_volume_liters`
- detailní rostliny slouží:
  - k návrhu konfigurace
  - k vizualizaci ve web UI
- node samotný pracuje pouze s výsledným objemem zóny

---

## Fallback a robustness

Node Manager umožňuje definovat:

- chování při chybě počasí
- chování při zastaralých datech
- minimální a maximální limity zavlažování
- strategii batchování zón

Tyto informace jsou:
- ukládány v databázi
- serializovány do JSON
- používány SIS node logikou

---

## Datový model (DB)

### SQLite (MVP)

- jednoduché nasazení
- nulová režie
- ideální pro cvičný projekt

### SQLModel

- kombinuje:
  - SQLAlchemy (ORM)
  - Pydantic (validace)
- umožňuje:
  - čistý model
  - snadný přechod na PostgreSQL v budoucnu

Nested konfigurace jsou ukládány jako:
- **JSON columns**

---

## API filozofie

API používá **oddělené schemas**:

- `Create` – vstup od UI
- `Update` – partial update
- `Read` – detail
- `ListRead` – lightweight přehled

To umožňuje:
- optimalizaci přenosu dat
- jasné API kontrakty
- lepší škálování UI

---

## Stav projektu

### Aktuální fáze
**FÁZE 1 – MVP backend**

Hotovo:
- architektura projektu
- SQLModel entity (Node, Zone)
- Pydantic schemas
- zápis do DB + testy
- návrh finální struktury JSON konfigurací

Rozpracováno:
- Repository layer
- Service layer
- REST endpoints

---

## Roadmapa (zkráceně)

### Fáze 1 – MVP (2 týdny)
- CRUD Node / Zone
- export JSON
- backend + frontend základ
- základní testy
- docker-compose

### Fáze 2 – rozšíření
- lepší validace
- lepší error handling
- refactoring
- CI/CD

---

## Cíle z hlediska učení

Tento projekt slouží k:
- osvojení REST API návrhu
- práci s ORM
- návrhu doménového modelu
- clean architecture
- přípravě projektu vhodného do CV

---

## Licence

MIT License  
© 2025 Lukáš Soják
