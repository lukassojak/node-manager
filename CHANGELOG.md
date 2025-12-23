# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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