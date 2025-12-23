# Zone Configuration Wizard – Detailní popis kroků

Tato kapitola popisuje **stránku / wizard pro vytvoření nové zavlažovací zóny** v aplikaci Node Manager.  
Wizard je klíčovým UX prvkem celé aplikace a zároveň místem, kde se nejvíce liší **FÁZE 1 (MVP)** a **FÁZE 2 (rozšířená logika)**.

Cílem wizardu je:
- vést uživatele krok za krokem,
- minimalizovat chybné konfigurace,
- na konci vytvořit **jednoznačnou a validní konfiguraci zóny**.

---

## Přehled wizardu

Wizard je rozdělen do **logických kroků**, které odpovídají doméně SIS:

1. Základní informace o zóně
2. Volba zavlažovacího režimu
3. Konfigurace zavlažování (liší se podle režimu)
4. Konfigurace emitorů (liší se podle fáze)
5. Rekapitulace a vytvoření zóny

Ne všechny kroky jsou ve všech režimech / fázích povinné.

---

# FÁZE 1 – MVP (aktuální cílová implementace)

V této fázi je cílem **jednoduchost, transparentnost a kompatibilita s backendem**.  
Uživatel zadává **už finální data**, backend je pouze uloží a exportuje.

---

## Krok 1: Základní informace o zóně

**Cíl:** Identifikace zóny a její fyzické napojení.

### Vstupy:
- Název zóny (string)
- Relay pin / výstup (int)
- Přepínač `enabled` (bool)

### Poznámky:
- Název je pouze informační (UI + export).
- Relay pin musí odpovídat hardware konfiguraci nodu.
- ID zóny je generováno backendem.
- `enabled=false` umožňuje mít zónu v konfiguraci, ale runtime ji přeskočit.

---

## Krok 2: Volba zavlažovacího režimu

**Cíl:** Rozhodnout, jakým způsobem bude zóna zavlažována.

### Volby:
- `even_area` – rovnoměrné zavlažování plochy se známou plochou
- `per_plant` – zavlažování podle potřeb jednotlivých rostlin okruhu (např. pro různé rostliny v květináčích)

Volba režimu **určuje další kroky wizardu**.

---

## Krok 3A: Konfigurace – even_area režim

**Cíl:** Definovat zavlažovanou plochu a cílovou dávku vody.

### Vstupy:
- `zone_area_m2` (float) - rozloha zavlažované plochy v m²
- `target_mm` (float) - cílová výška vody v mm pro danou plochu; bazální hodnota platící pro bazální podmínky (počasí) - SIS node na ni při běhu aplikuje korekce podle aktuálních podmínek

### Výsledek:
- UI uloží `IrrigationConfigurationEvenArea`
- Backend data pouze uloží
- SIS vypočítá základní objem vody runtime logikou

---

## Krok 3B: Konfigurace – per_plant režim (MVP)

**Cíl:** Definovat výsledný objem vody pro celou zónu.

### Vstupy:
- `base_target_volume_liters` (float) - cílové množství vody v litrech pro celou zónu za bazálních podmínek (počasí)

### Poznámky:
- Uživatel:
  - si hodnotu dopočítá ručně
  - nebo ji odhadne
- Detailní rostliny v dalším kroku - nejsou použity pro výpočet

---

## Krok 4: Konfigurace emitorů (MVP)

**Cíl:** Zadat **finální konfiguraci emitorů**, kterou SIS přímo použije.

### even_area:
- seznam typů emitorů
- jejich průtok
- počet
- tlačítko „Přidat emitor“:
    - nový řádek s výběrem typu, průtokem a počtem

### per_plant:
- seznam rostlin
- ke každé rostlině:
  - typ emitoru
  - průtok
  - počet
- tlačítko „Přidat rostlinu“:
    - nový řádek s výběrem id rostliny, názvem, a možností přidat emitor(y)
    - tlačítko „Přidat emitor“ pro danou rostlinu:
        - nový řádek s výběrem typu, průtokem a počtem

> Pozn.: V této fázi UI **neprovádí žádné výpočty**.
> Uživatel zadává **přesnou konfiguraci**, kterou chce použít.
> ID ve fázi 1 nejsou nijak validována a nejsou generována backendem - uživatel je zadává ručně.

### Výsledek:
- UI vytvoří:
  - `EmittersConfigurationEvenArea`
  - nebo `EmittersConfigurationPerPlant`
- Backend konfiguraci pouze uloží

---

## Krok 5: Rekapitulace a vytvoření zóny

**Cíl:** Kontrola před uložením.

### Zobrazeno:
- název zóny
- režim zavlažování
- cílové množství vody
- přehled emitorů

### Akce:
- „Vytvořit zónu“
- POST `/nodes/{id}/zones`

---

# FÁZE 2 – Rozšířený wizard (plánovaný)

Ve fázi 2 se wizard stává **návrhovým nástrojem**, nikoli jen formulářem.

Uživatel:
- zadává cíle a omezení,
- backend provádí výpočty a optimalizaci.

---

## Krok 1 & 2

Beze změny:
- základní informace
- volba režimu

---

## Krok 3: Rostliny (per_plant – rozšířeně)

**Cíl:** Popsat potřeby jednotlivých rostlin.

### Vstupy:
- seznam rostlin:
  - název
  - požadované množství vody v litrech (pro bazální podmínky)
- možnost:
  - „lock“ rostliny (množství nesmí být změněno při optimalizaci, viz krok 5)

### Výstup:
- návrhová data (pouze rekapitulace pro uživatele)

---

## Krok 4: Dostupné emitory

**Cíl:** Popsat fyzická omezení systému.

### Vstupy:
- seznam typů dostupných emitorů:
  - průtok (l/h)
  - dostupné množství / neomezeno

---

## Krok 5: Optimalizační strategie

**Cíl:** Ovlivnit chování optimalizačního algoritmu.

### Volby:
- `most_accuracy`
  - maximální přesnost dávky vody (podle požadavků rostlin)
  - více použitých emitorů
- `optimize_drippers_count`
  - méně emitorů
  - tolerovaná odchylka (případně nastavitelná hodnota uživatelem)
- per-plant lock:
  - některé rostliny zůstanou přesné (podle kroku 3)

---

## Krok 6: Výsledek optimalizace

**Cíl:** Transparentně ukázat, co backend vypočítal.

### Zobrazeno:
- výsledná konfigurace emitorů
- skutečné dodané množství vody pro každou rostlinu
- odchylky oproti požadavkům

Uživatel může:
- přijmout výsledek
- vrátit se a upravit vstupy

---

## Krok 7: Rekapitulace a vytvoření zóny

Backend:
- z návrhových dat vypočítá:
  - `EmittersConfigurationPerPlant`
  - `IrrigationConfigurationPerPlant`
- uloží **pouze runtime konfiguraci**
- export zůstává beze změny

---

## Shrnutí rozdílu FÁZE 1 vs FÁZE 2

| Oblast | FÁZE 1 (MVP) | FÁZE 2 |
|------|-------------|--------|
| UI | formulář | návrhový wizard |
| Výpočty | žádné | backend |
| Uživatel zadává | finální config | cíle + omezení |
| Backend | ukládá | optimalizuje |
| SIS | runtime execution | runtime execution |

---

## Zásadní architektonická výhoda

I přes výrazné rozšíření wizardu:
- **export formát se nemění**
- **SIS API se nemění**

Mění se pouze:
- zdroj dat
- způsob jejich výpočtu
- případně DB schéma na backendu (rostliny zóny json -> tabulka), API