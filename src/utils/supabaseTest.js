import { supabase } from '../supabaseClient';

/**
 * Tests the connection to Supabase by striving to fetch a single row from the 'party' table.
 * Displays an alert and logs to console based on the result.
 */
export const testSupabaseConnection = async () => {
    console.group("🔌 Supabase Connection Test");
    try {
        console.log("Attempting to fetch data from 'party' table...");

        // Try fetching 1 record to verify read access
        const { data, error } = await supabase
            .from('party')
            .select('*')
            .limit(1);

        if (error) {
            throw error;
        }

        console.log("✅ Success! Data received:", data);
        console.groupEnd();
        alert("Supabase is connected ✅");
        return { success: true, data };

    } catch (err) {
        console.error("❌ Connection failed or table 'party' not found.");
        console.error("Error Details:", err);
        console.groupEnd();

        // Show the actual error message to the user
        const errorMessage = err.message || JSON.stringify(err);
        alert(`Supabase connection failed ❌\n\nError: ${errorMessage}\n\nCheck console for more details.`);

        return { success: false, error: err };
    }
};
