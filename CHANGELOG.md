# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-12-30

### Added
- Frontend MVP with polished and consistent UI
- Node dashboard with responsive card-based layout
- Detailed Node view with:
  - zone overview cards
  - correction factor indicators
  - node configuration summary
- Zone configuration wizard with multi-step validation
- Advanced Create Node form with:
  - primary and advanced configuration sections
  - collapsible advanced settings
  - contextual help panels for complex options

### Changed
- Refined frontend layout, spacing, and visual hierarchy
- Improved UX clarity for node and zone configuration flows
- Unified design language across dashboard, node, and zone views
- Clarified separation between primary and advanced configuration options

### Fixed
- Multiple frontend state and validation edge cases
- Navigation and routing inconsistencies in node/zone flows

### Removed
- Early prototype UI elements and temporary placeholders

### Known Issues
- Advanced configuration options are not yet editable after node creation
- Backend validation errors are not fully surfaced in the UI
- Zone detail page & zone configuration wizard are still not polished
- Zone is not editable after creation

---

## [0.3.0] - 2025-12-28

### Added
- Initialize frontend project structure with React and JavaScript
- Set up basic routing
- Implement frontend prototype:
  - dashboard page
  - node and zone listing views
  - node creation page
  - zone configuration wizard interface

### Changed

### Fixed

### Removed

### Known Issues

---

## [0.2.0] - 2025-12-21

### Added
- REST API endpoints for Node and Zone configuration management
- Zone sub-resources scoped under Node aggregate (`/nodes/{id}/zones`)
- Support for creating, listing, retrieving and deleting zones
- Automatic cascading delete of zones when deleting a node
- Node configuration export in SIS-compatible `node_X_config.json` format
- Metadata section in exported configuration (version, last_updated, exported_at)
- REST endpoint for exporting node configuration (`GET /nodes/{id}/export`)
- `docs/ZONE_CONFIG_WIZARD.md` documentation for Zone Configuration Wizard

### Changed
- Updated NodeService to enforce node–zone relationship validation
- Improved schema mapping using Pydantic `from_attributes` configuration
- Refined domain model relationships for safe cascade operations
- Clarified separation between configuration planning (Node Manager) and runtime execution (SIS)
- Prepared backend architecture for future irrigation computation and optimization logic
- `README.md` updated

### Fixed

### Removed

### Known Issues

---

## [0.1.0] - 2025-12-20

### Added
- initial project setup
- basic skeleton structure
- schema definitions in `schemas/` directory
- JSON column support for nested Node configurations (`hardware`, `irrigation_limits`, `automation`, `batch_strategy`, `logging`)
- JSON column support for nested Zone configurations (`irrigation_configuration`, `emitters_configuration`, `local_correction_factors`, `frequency_settings`, `fallback_strategy`)
- `IrrigationMode` enum for Zone model
- index on `Node.name` and `Zone.name`
- improved `last_updated` handling using timezone-aware default factory
- new unified structure for `node_X_config.json` reflecting irrigation modes
- Implemented repository layer for Node and Zone entities
- Added NodeRepository with CRUD operations and domain-specific zone access
- Added ZoneRepository with CRUD operations and node-scoped queries
- Introduced consistent repository contract using `flush()` instead of `commit()`
- Added unit tests for NodeRepository and ZoneRepository using in-memory SQLite
- Implemented service layer `NodeService` for Node business logic

### Changed

### Fixed

### Removed

### Known Issues
- automatic update of `last_updated` field is not yet handled in service layer