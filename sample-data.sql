-- Clear existing data
TRUNCATE TABLE company_info RESTART IDENTITY CASCADE;
TRUNCATE TABLE company_stock RESTART IDENTITY CASCADE;
TRUNCATE TABLE company_financials RESTART IDENTITY CASCADE;

-- drop table company_financials;
-- drop table company_stock;

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'company_stock';

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'company_financials';

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'company_info';

-- Company Info
INSERT INTO company_info (ticker, name, industry) VALUES
  ('AAPL', 'Apple Inc.', 'Technology'),
  ('GOOG', 'Google LLC', 'Technology'),
  ('TSLA', 'Tesla Inc.', 'Automotive');

-- Company Stock
INSERT INTO company_stock (ticker, marketvalue, price) VALUES
  ('AAPL', 250000000, 172.1),
  ('GOOG', 180000000, 135.9),
  ('TSLA', 700000000, 187.3);

-- Company Financials
INSERT INTO company_financials (ticker, revenue, income) VALUES
  ('AAPL', 394000000, 99900000),
  ('GOOG', 280000000, 76000000),
  ('TSLA', 810000000, 12500000);