"""Shared test configuration for the whole test tree.

JWT_SECRET must exist before race_command_center.auth_core is first
imported — the module aborts startup (RuntimeError) when it is unset.
"""
import os

os.environ.setdefault("JWT_SECRET", "test-secret-not-for-production")
