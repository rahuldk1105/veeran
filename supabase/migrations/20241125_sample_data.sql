-- Insert sample metrics data
INSERT INTO metrics (metric_name, value, category, recorded_at) VALUES
('Total Revenue', 45231.50, 'Finance', NOW() - INTERVAL '1 day'),
('Active Users', 2345, 'Users', NOW() - INTERVAL '1 day'),
('Conversion Rate', 3.24, 'Sales', NOW() - INTERVAL '1 day'),
('Avg Order Value', 128.00, 'Sales', NOW() - INTERVAL '1 day'),
('Page Views', 24567, 'Traffic', NOW() - INTERVAL '1 day'),
('Bounce Rate', 32.4, 'Engagement', NOW() - INTERVAL '1 day'),
('Session Duration', 272, 'Engagement', NOW() - INTERVAL '1 day'),
('New Users', 45, 'Users', NOW() - INTERVAL '1 day'),
('Active Sessions', 128, 'Traffic', NOW() - INTERVAL '1 day'),
('Revenue Today', 1234.00, 'Finance', NOW());