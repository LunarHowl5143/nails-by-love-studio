# Catalyst Data Store Schema

Catalyst Data Store is the source of truth.

## services
- id
- name
- slug
- description
- category
- duration_minutes
- price
- currency
- image_file_id
- is_active
- sort_order
- created_time
- modified_time

## offers
- id
- title
- description
- service_id (nullable)
- discount_type
- discount_value
- starts_at
- ends_at
- is_active
- created_time
- modified_time

## portfolio_items
- id
- title
- description
- image_file_id
- sort_order
- is_published
- created_time
- modified_time

## bookings
- id
- booking_reference
- customer_name
- customer_email
- customer_phone
- appointment_date
- appointment_time
- subtotal
- discount_amount
- total_amount
- status
- notes
- created_time
- modified_time

## booking_items
- id
- booking_id
- service_id
- service_name_snapshot
- unit_price_snapshot
- quantity
- selected_extras_json

## delivery_requests
- id
- booking_id (nullable)
- customer_name
- customer_phone
- requested_address
- requested_area
- latitude (nullable)
- longitude (nullable)
- status
- owner_notes
- created_time
- modified_time

## business_settings
- id
- setting_key
- setting_value_json
- modified_time

## audit_logs
- id
- actor_type
- actor_id
- action
- entity_type
- entity_id
- metadata_json
- created_time

## Important modeling rule

Never trust customer-submitted prices, totals, service names, offer discounts, or availability. Catalyst Functions must read current server-side records and calculate/validate the final booking before persistence.
