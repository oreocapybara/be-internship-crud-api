const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY || !SUPABASE_URL) {
	throw new Error("Missing SUPABASE_KEY or SUPABASE_URL in .env");
}

supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = {
	supabase,
};
