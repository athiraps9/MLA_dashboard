# Sample Data Reference

You can populate your local MongoDB database with the sample data by running the following command in the `server` directory:

```bash
node seed-script.js
```

> [!WARNING]
> Running this script will **DELETE** all existing users, projects, and attendance records in your database before inserting the new sample data.

## User Credentials

Use these credentials to log in to the dashboard:

| Role | Username | Password | District | Name |
|------|----------|----------|----------|------|
| **Admin** | `admin` | `adminpassword` | N/A | System Administrator |
| **MLA** | `mla_bangalore_south` | `password123` | Bangalore South | Ramesh Kumar |
| **MLA** | `mla_mysore` | `password123` | Mysore | Suresh Patil |

## Data Overview

### Projects
The seed script creates 3 projects:
1. **Road Repair** (MLA: Bangalore South) - Approved, 50% funds utilized.
2. **Park Renovation** (MLA: Bangalore South) - Pending, 0% funds utilized.
3. **School Lab Upgrade** (MLA: Mysore) - Approved, 100% funds utilized.

### Attendance
The seed script creates 3 attendance records:
1. **Presentation** (MLA: Bangalore South) - Verified.
2. **Committee Meeting** (MLA: Bangalore South) - Verified.
3. **Question Hour** (MLA: Mysore) - Unverified (Pending).
