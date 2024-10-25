//importing packages
const { createClient } = require('@supabase/supabase-js');
const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');

//supabase API key and URL
const supabaseUrl = '';
const supabaseKey = '';
const supabase = createClient(supabaseUrl, supabaseKey);

const port = new SerialPort('COM7', {baudeRate: 9600});
const parser = port.pipe(new ReadLine({ delimiter: '\r\n' }));

//method that saves humidity data to database
async function saveHumidity(humidity) {
    const { data, error } = await supabase .from('humidity_log')
                                           .insert([{ humidity_value: humidity, timestap: new Date() }]);

    if (error) {
        console.error('Error inserting humidity data:', error.message);
    }
    else {
        console.log('Humidity data saved:', data);
    }
}

//method that saves moisture data to database
async function saveMoisture(moisture) {
    const { data, error } = await supabase .from('moisture_data')
                                           .insert([{ moisture_value: moisture, timestap: new Date() }]);

    if (error) {
        console.error('Error inserting moisture data:', error.message);
    }
    else {
        console.log('Moisture data saved:', data);
    }
}

//method that saves temperature data to database
async function saveTemperature(temperature) {
    const { data, error } = await supabase .from('temperature_data')
                                           .insert([{ temperature_value: temperature, timestap: new Date() }]);

    if (error) {
        console.error('Error inserting temperature data:', error.message);
    }
    else {
        console.log('Moisture data saved:', data);
    }
}

//getting data from arduino
parser.on('data', (data) => {
    console.log('Received data:', data);

    const parts = data.split(',');
    const humidity = parts[0].split(':')[1];
    const moisture = parts[1].split(':')[1];
    const temperature = parts[2].split(':')[1];

    ///saving the collected data
    saveHumidity(humidity);
    saveMoisture(moisture);
    saveTemperature(temperature);
});

port.on('error', (err) => {
    console.error('Error with serial port:', err.message);
});
