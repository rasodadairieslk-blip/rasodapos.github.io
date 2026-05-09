HOW TO OPERATE THE BUSINESS MANAGEMENT APP

UPDATE: The superadmin portal and POS application have been unified into a single index.html file.

1) Login page with two options
   - POS login for normal admin/staff users
   - Superadmin login for outlet configuration

2) Superadmin credentials
   - Username: superadmin
   - Password: superadmin

3) What each login does
   - POS login: signs in a staff or admin user and opens the POS dashboard.
   - Superadmin login: gives access to the Outlet Configuration section for managing outlets and users.

4) Unified interface (index.html + app.js)
   - Both POS and superadmin portals are now in one index.html file
   - The app switches sections based on login role
   - Regular users see: Dashboard, POS, Products, Users, Inventory, Reports, Settings
   - Superadmin sees: Outlet Configuration (for tenant management)

5) User database and outlet configuration
   - Regular users are stored in the Dexie local database (users table)
   - Superadmin is hardcoded (username: superadmin, password: superadmin)
   - To add outlets and assign users, use the Outlet Configuration section

6) Default test credentials
   - Admin: username = "admin", password = "admin123"
   - Staff: username = "staff", password = "staff123"
   - Superadmin: username = "superadmin", password = "superadmin"

7) Deployment
   - Push index.html and app.js to your hosting
   - No server required; everything runs in the browser
   - Data persists using Dexie (local storage)
