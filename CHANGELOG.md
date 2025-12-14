# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Changed

### Fixed

### Removed

### Known Issues
- automatic update of `last_updated` field is not yet handled in service layer