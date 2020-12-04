# Migration `20201204224631`

This migration has been generated by alexis anzieu at 12/4/2020, 5:46:31 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `Ad` MODIFY `categories` ENUM('DIVERS', 'CUISINE', 'ELECTRONIQUE', 'MAISON', 'SERVICE', 'VETEMENT') NOT NULL DEFAULT 'DIVERS'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201128232941..20201204224631
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "mysql"
-  url = "***"
+  url = "***"
 }
 model Event {
   id   Int @id @default(autoincrement())
@@ -53,13 +53,13 @@
   updatedAt DateTime @updatedAt
   title String
   description String
   zipCode String
-  categories AdCategory @default(AUTRE)
+  categories AdCategory @default(DIVERS)
 }
 enum AdCategory {
-  AUTRE
+  DIVERS
   CUISINE
   ELECTRONIQUE
   MAISON
   SERVICE
```

