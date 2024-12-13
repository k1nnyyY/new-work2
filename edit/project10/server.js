





const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = 'https://zqoasahgiyffqzpviewe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxb2FzYWhnaXlmZnF6cHZpZXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzOTM0NDAsImV4cCI6MjA0ODk2OTQ0MH0.WPykmBtj0hUE02FANowevpEetVO5aJ7aslmAvLHGynA';

// Создайте клиент
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
