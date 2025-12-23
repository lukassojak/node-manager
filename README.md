# Node Manager

**Node Manager** je samostatná backendová + frontendová webová aplikace určená ke konfiguraci zavlažovacích nodů pro projekt **Smart Irrigation System (SIS)**.

Projekt má dva hlavní účely:
- 🎓 **učební / demonstrační projekt** (začátečník → junior → strong junior backend),
- 🌱 **praktický konfigurační nástroj** pro reálný IoT systém.

Node Manager **není runtime součástí SIS**.  
Slouží výhradně k **návrhu, validaci, ukládání a exportu konfigurací**, které jsou následně:
- nahrány do SIS serveru,
- nebo distribuovány přímo na jednotlivé nody.

---

## High-level cíl projektu

Cílem Node Manageru je:
- nahradit ruční editaci JSON konfigurací,
- poskytnout strukturované REST API pro správu:
  - zavlažovacích nodů
  - jejich zón
  - parametrů zavlažování
- generovat **finální, SIS-kompatibilní konfigurační soubory**.

Projekt je navržen jako **nearly-production-grade backend aplikace** se zaměřením na:
- clean architecture
- separation of concerns
- čitelnost a dlouhodobou rozšiřitelnost
- realistické job-relevant patterns (service layer, repository layer, DTOs)

---

## Vztah k projektu Smart Irrigation System (SIS)

**Smart Irrigation System (SIS)** je distribuovaný IoT systém:

### Edge Node
- Raspberry Pi Zero 2 W
- autonomní řízení zavlažování
- multithreading, fail-safe logika
- práce s počasím, korekce, fallback strategie

### Central Server
- MQTT komunikace s nody
- REST API
- monitoring a orchestrace

### Web UI
- přehled stavu nodů
- monitoring zavlažování

👉 **Node Manager není součást runtime architektury SIS**  
👉 Slouží pouze jako **konfigurační a plánovací nástroj**

---

## Architektura Node Manageru

### Backend (hlavní fokus projektu)

Backend je navržen jako klasická REST API aplikace:

- **FastAPI**
- **SQLModel (SQLAlchemy + Pydantic)**
- **SQLite** (MVP)

Architektura odpovídá clean-architecture stylu.

#### Logické vrstvy

- routers/ – HTTP / REST API vrstva
- services/ – aplikační a doménová logika (use-cases)
- repositories/ – perzistence a DB přístup
- models/ – SQLModel entity (DB reprezentace)
- schemas/ – Pydantic schémata (API kontrakty)
- exporters/ – export finálních SIS konfigurací
- db/ – session, engine, init

---

### Frontend (MVP)

- **React**
- **Chakra UI**
- jednoduché vizuálně atraktivní stránky + základní wizard flow

**Frontend**:
- není hlavním cílem projektu z hlediska komplexnosti,
- stálě by měl být dostatečně funkční, moderní a interaktivní pro dobrý UX,
- slouží jako **klient nad backend API**,
- demonstruje end-to-end flow:
  - konfigurace → uložení → export.

**Očekávané minimální stránky**:
1. Hlavní dashboard zobrazující:
  - přehled aktuální konfigurace systému jako celku (`system_config.json`),
  - možnost editovat systémovou konfiguraci,
  - tlačítko pro export systémové konfigurace,
  - seznam nodů a jejich minimalistické detaily (možnost kliknout na detail nodu - vede na stránku 2)
  - tlačítko pro export nodu u každého nodu,
  - tlačítko pro vytvoření nového nodu.

2. Stránka pro detail nodu:
  - zobrazuje kompletní přehled konfigurace nodu,
  - tlačítko pro export konfigurace nodu,
  - tlačítko pro odstranění nodu,
  - přehled zón nodu včetně jejich minimalistických detail (možnost kliknout na detail zóny - vede na stránku 3),
  - tlačítko pro vytvoření nové zóny,
  - tlačítko pro editaci nodu (pro 2. fázi, není v základním MVP).

3. Stránka pro detail zóny:
  - zobrazuje kompletní přehled konfigurace zóny,
  - tlačítko pro odstranění zóny,
  - tlačítko pro editaci zóny (pro 2. fázi, není v základním MVP).

4. Stránka pro vytvoření nového nodu:
  - formulář pro zadání všech potřebných parametrů nodu,
  - tlačítko pro uložení nového nodu,
  - node se vytváří vždy bez zón,
  - po vytvoření přesměrování na detail nodu (stránka 2).

5. Stránka pro vytvoření nové zóny daného nodu:
  - vícekrokový konfigurační wizard pro dobrý UX bez zahlcení uživatele technickými detaily,
  - více podrobností v [dokumentaci wizardu](docs/ZONE_CONFIG_WIZARD.md),

---

## Základní doménové pojmy

### Node

Node reprezentuje **jeden fyzický zavlažovací uzel** (např. skleník, zahrada).

Obsahuje:
- identitu a metadata
- hardware konfiguraci
- zavlažovací limity
- strategie batchování a automatizace
- kolekci zavlažovacích zón

Node je **aggregate root** celé domény.

---

### Zone

Zone reprezentuje **jeden zavlažovací okruh** (ventil / relé).

- vždy patří právě jednomu Node
- nemůže existovat samostatně
- definuje:
  - způsob zavlažování
  - množství vody
  - frekvenci
  - chování při chybách

---

## Konfigurační výstupy

Node Manager generuje **finální konfigurační soubory** používané SIS.

---

### `node_X_config.json` (hlavní výstup)

Konfigurace **jednoho konkrétního nodu**.

- je **finálním artefaktem** pro SIS
- SIS s ní pracuje bez další transformace
- Node Manager funguje jako „compiler“ konfigurace

Obsahuje:
- metadata (verze, čas exportu)
- identitu nodu
- hardware konfiguraci
- zavlažovací limity
- seznam zón

Export je deterministický a auditovatelný.

---

## Irrigation modes (klíčový koncept)

Každá zóna pracuje v jednom z režimů:

### `even_area`
- rovnoměrné zavlažování plochy
- vstupy:
  - `zone_area_m2`
  - `target_mm`
- SIS vypočítá základní objem vody

---

### `per_plant`
- zavlažování podle potřeb jednotlivých rostlin
- SIS pracuje pouze s:
  - výsledným objemem zóny
  - výslednou konfigurací emitorů

#### Rozdělení odpovědnosti
- **Node Manager**:
  - návrh konfigurace
  - (v budoucnu) optimalizační výpočty
- **SIS Node**:
  - runtime aplikace výsledné konfigurace

---

## Dvoufázový návrh výpočetní logiky

### FÁZE 1 – MVP (aktuální stav)
- UI dodává:
  - `EmittersConfigurationPerPlant`
  - `IrrigationConfigurationPerPlant`
- backend:
  - data pouze validuje
  - uloží
  - exportuje
- žádné výpočty v backendu

👉 jednoduché, stabilní, rychlé MVP

---

### FÁZE 2 – Rozšíření (plánováno)
- UI dodává:
  - požadované množství vody pro rostliny
  - dostupné drippery
  - optimalizační strategii
- backend:
  - vypočítá:
    - výslednou konfiguraci emitorů
    - skutečný base target volume
- **DB schéma, export i SIS API zůstávají beze změny**

---

## Datový model

### SQLite (MVP)
- jednoduché nasazení
- minimální režie
- ideální pro demonstrační projekt

### SQLModel
- kombinuje:
  - SQLAlchemy (ORM)
  - Pydantic (validace)
- umožňuje:
  - čistý doménový model
  - snadný přechod na PostgreSQL

Nested konfigurace jsou ukládány jako:
- **JSON columns**

---

## API filozofie

API používá oddělená schémata:

- `Create` – vstup od UI
- `Update` – částečné změny
- `Read` – detail
- `ListRead` – lightweight přehled

Zóny jsou **vždy adresovány v kontextu nodu**: `/nodes/{node_id}/zones`

---

## Stav projektu

### Aktuální stav
✅ **Backend MVP hotový**

- kompletní REST API pro Node a Zone
- service + repository vrstvy
- domain-safe validace
- export `node_X_config.json`
- připravený prostor pro fázi 2

🔄 **Frontend MVP – cíl dokončit MVP během 2-4 dnů**

---

## Roadmapa (zjednodušeně)

### Fáze 1 – MVP
- Node / Zone CRUD
- export konfigurací
- backend + frontend základ
- testy service vrstvy

### Fáze 2 – Rozšíření
- optimalizační výpočty
- lepší validace
- CI/CD
- UX vylepšení

---

## Cíle z hlediska učení

Projekt slouží k osvojení:
- návrhu REST API
- práce s ORM
- doménového modelování
- clean architecture
- návrhu systémů vhodných do CV a na pohovor

---

## Licence

MIT License  
© 2025 Lukáš Soják
