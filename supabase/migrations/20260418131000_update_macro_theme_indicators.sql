DELETE FROM macro_indicators;

INSERT INTO macro_indicators (label, value, delta, direction, sort_order) VALUES
('US Fiscal Deficit', '6.2%', '+0.4%', -1, 1),
('CRE Refi Wall', '$1.2T', '+200B', -1, 2),
('Global Defense YoY', '+9.4%', '+1.2%', 1, 3),
('M2 Supply Growth', '0.8%', '-0.2%', -1, 4);
