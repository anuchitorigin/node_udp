import dgram from 'node:dgram';

const SS_CONVERT = 65536;

function calculate_crc(data: string) {
  let crc = 0x00;
  for (let i=0; i<data.length; i++) {
    crc ^= data.charCodeAt(i);
  }
  return crc;
}

function decode_data_format(name: string, data: string) {
  const alphanumeric = data.substring(0, 4);
  const scaletype = data.substring(4, 6);
  const unittype = data.substring(6, 8);
  // -- Find numeric part
  let numeric = parseInt(alphanumeric, 16);
  let unit = '';
  if (Number.isNaN(numeric)) {
    unit = 'NaN';
  }
  if (unit != 'NaN') {
    // -- Find scale
    switch (scaletype) {
      // case '00':
      //   numeric *= 1;
      //   break;
      case '01':
        numeric *= 10;
        break;
      case '02':
        numeric *= 100;
        break;
      case '03':
        numeric *= 1000;
        break;
      case '04':
        numeric *= 0.1;
        break;
      case '05':
        numeric *= 0.01;
        break;
      case '06':
        numeric *= 0.001;
        break;
      case '80':
        numeric *= -1;
        break;
      case '81':
        numeric *= -10;
        break;
      case '82':
        numeric *= -100;
        break;
      case '83':
        numeric *= -1000;
        break;
      case '84':
        numeric *= -0.1;
        break;
      case '85':
        numeric *= -0.01;
        break;
      case '86':
        numeric *= -0.001;
        break;
      case 'FF': // -- No data
        unit = 'null';
        break;
      default:
        break;
    }
    // -- Find unit
    switch (unittype) {
      // case '00': // RFU
      //   unit = '';
      //   break;
      case '01': // duty
        unit = '%';
        break;
      case '02': // pressure
        unit = 'Pa';
        break;
      // case '03': // latitude
      //   unit = '';
      //   break;
      // case '04': // longitude
      //   unit = '';
      //   break;
      case '05': // inductance
        unit = 'H';
        break;
      case '06': // energy
        unit = 'J';
        break;
      case '07': // count
        unit = 'time';
        break;
      case '08': // angular acceleration
        unit = 'rad/s2';
        break;
      case '09': // thermal diffusivity
        unit = 'm2/s';
        break;
      case '0A': // angular velocity
        unit = 'rad/s';
        break;
      case '0B': // degree
        unit = '°';
        break;
      case '0C': // acceleration
        unit = 'm/s2';
        break;
      case '0D': // luminance
        unit = 'cd/m2';
        break;
      case '0E': // absorbed dose
        unit = 'Gy';
        break;
      case '0F': // absorbed dose rate
        unit = 'Gy/s';
        break;
      // case '10': // refractive index
      //   unit = '';
      //   break;
      case '11': // catalytic activity
        unit = 'kat';
        break;
      case '12': // catalytic activity per volume
        unit = 'kat/m3';
        break;
      case '13': // luminous flux
        unit = 'lm';
        break;
      case '14': // luminous intensity
        unit = 'cd';
        break;
      case '15': // conductance
        unit = 'S';
        break;
      case '16': // size
        unit = 'Byte';
        break;
      case '17': // magnetization
        unit = 'A/m';
        break;
      case '18': // second
        unit = 'sec';
        break;
      case '19': // hour
        unit = 'hour';
        break;
      case '1A': // minute
        unit = 'minute';
        break;
      case '1B': // second
        unit = 's';
        break;
      case '1C': // millisecond
        unit = 'ms';
        break;
      case '1D': // power
        unit = 'W';
        break;
      case '1E': // magnetic flux
        unit = 'Wb';
        break;
      case '1F': // magnetic flux density
        unit = 'T';
        break;
      case '20': // mass
        unit = 'kg';
        break;
      case '21': // mass absorping coefficient
        unit = 'm2/kg';
        break;
      case '22': // mass concentration
        unit = 'kg/m3';
        break;
      case '23': // molality
        unit = 'mol/kg';
        break;
      case '24': // mass flow rate
        unit = 'kg/s';
        break;
      case '25': // mass flow rate per unit area
        unit = 'kg/(m2*s)';
        break;
      case '26': // frequency
        unit = 'Hz';
        break;
      case '27': // exposure
        unit = 'C/kg';
        break;
      case '28': // illuminance
        unit = 'lx';
        break;
      // case '29': // value
      //   unit = '';
      //   break;
      case '2A': // Celsius
        unit = '°C';
        break;
      case '2B': // equivalent dose
        unit = 'Sv';
        break;
      case '2C': // relative humidity
        unit = '%RH';
        break;
      case '2D': // volume
        unit = 'm3';
        break;
      case '2E': // energy density 
        unit = 'J/m3';
        break;
      case '2F': // volumetric flow
        unit = 'm3/s';
        break;
      case '30': // force
        unit = 'N';
        break;
      case '31': // torque
        unit = 'N*m';
        break;
      case '32': // voltage
        unit = 'V';
        break;
      case '33': // electric charge
        unit = 'C';
        break;
      case '34': // electric field strength
        unit = 'V/m';
        break;
      case '35': // electric charge density
        unit = 'C/m3';
        break;
      case '36': // electrical resistance
        unit = 'Ω';
        break;
      case '37': // electrical capacitance
        unit = 'F';
        break;
      case '38': // electric displacement field
        unit = 'C/m2';
        break;
      case '39': // current
        unit = 'A';
        break;
      case '3A': // current density
        unit = 'A/m2';
        break;
      case '3B': // electric energy
        unit = 'kWh';
        break;
      case '3C': // magnetic permeability
        unit = 'H/m';
        break;
      case '3D': // conductivity
        unit = 'S/m';
        break;
      case '3E': // kinematic viscosity
        unit = 'm2/s';
        break;
      case '3F': // length
        unit = 'm';
        break;
      case '40': // solar irradiance
        unit = 'kW/m2';
        break;
      case '41': // thermal conductivity
        unit = 'W/(m*K)';
        break;
      case '42': // heat capacity
        unit = 'J/K';
        break;
      case '43': // Kelvin
        unit = 'K';
        break;
      case '44': // heat flux density
        unit = 'W/m2';
        break;
      case '45': // viscosity
        unit = 'Pa*s';
        break;
      case '46': // concentration
        unit = 'ppm';
        break;
      case '47': // wavenumber
        unit = 'm-1';
        break;
      case '48': // velocity
        unit = 'm/s';
        break;
      case '49': // absorbed dose
        unit = 'J/kg';
        break;
      // case '4A': // relative permeability
      //   unit = '';
      //   break;
      case '4B': // specific heat capacity
        unit = 'J/(kg*K)';
        break;
      case '4C': // specific volume
        unit = 'm3/kg';
        break;
      case '4D': // surface tension
        unit = 'N/m';
        break;
      case '4E': // surface charge
        unit = 'C/m2';
        break;
      case '4F': // amount of substance
        unit = 'mol';
        break;
      case '50': // radian
        unit = 'rad';
        break;
      case '51': // radiance
        unit = 'W/(m2*sr)';
        break;
      case '52': // radiant intensity
        unit = 'W/sr';
        break;
      case '53': // radioactivity, activity
        unit = 'Bq';
        break;
      case '54': // density
        unit = 'kg/m3';
        break;
      case '55': // area
        unit = 'm2'; 
        break;
      case '56': // area density
        unit = 'kg/m2';
        break;
      case '57': // molar energy
        unit = 'J/mol';
        break;
      case '58': // molar entropy
        unit = 'J/(mol*K)'; 
        break;
      case '59': // molar volume
        unit = 'm3/mol';
        break;
      case '5A': // molar conductivity
        unit = 'S*m2/mol';
        break;
      case '5B': // permittivity
        unit = 'F/m'; 
        break;
      case '5C': // momentum
        unit = 'N*s';
        break;
      case '5D': // steradian
        unit = 'sr';
        break;
      case '5E': // molarity
        unit = 'mol/m3'; 
        break;
      case '5F': // equivalent dose
        unit = 'uSv';
        break;
      // case '60': // PIR sensor
      //   unit = '';
      //   break;
      // case '61': // magnetic sensor
      //   unit = ''; 
      //   break;
      case '62': // current
        unit = 'mA';
        break;
      case '63': // acceleration RMS
        unit = 'm/s2';
        break;
      case '64': // air pressure
        unit = 'hPa'; 
        break;
      // case '65': // ADC output
      //   unit = '';
      //   break;
      // case '66': // kurtosis
      //   unit = '';
      //   break;
      // case '67': // vibration sensor
      //   unit = ''; 
      //   break;
      // case '68': // no unit
      //   unit = '';
      //   break;
      case '69': // power
        unit = 'W';
        break;
      case '6A': // flow rate
        unit = 'L/min'; 
        break;
      case '6B': // litre
        unit = 'L';
        break;
      // case '6C': // gas sensor
      //   unit = '';
      //   break;
      // case '6D': // vital sensor
      //   unit = ''; 
      //   break;
      // case '6E': // 0-5V sensor
      //   unit = '';
      //   break;
      // case '6F': // thermocouple sensor
      //   unit = '';
      //   break;
      // case '70': // edge detect
      //   unit = ''; 
      //   break;
      case '71': // angle
        unit = 'rad';
        break;
      case '72': // velocity
        unit = 'mm/s';
        break;
      case '73': // displacement
        unit = 'mm'; 
        break;
      case '74': // velocity RMS
        unit = 'mm/s';
        break;
      case '75': // analog sensor
        unit = '';
        break;
      // case 'FA': // ID
      //   unit = '';
      //   break;
      case 'FB': // electrical resistance
        unit = 'kΩ';
        break;
      // case 'FC': // send mode
      //   unit = '';
      //   break;
      // case 'FD': // validation
      //   unit = '';
      //   break;
      // case 'FE': // range over
      //   unit = ''; 
      //   break;
      // case 'FF': // abnormal
      //   unit = '';
      //   break;
      default:
        break;
    }
  }
  return {
    name: name,
    value: numeric,
    unit: unit,
  }
}

function read_CT(data: string) {
  let fields = [];
  fields.push(decode_data_format('packet_count',        data.substring(0, 8)));
  fields.push(decode_data_format('current1',            data.substring(8, 16)));
  fields.push(decode_data_format('current2',            data.substring(16, 24)));
  fields.push(decode_data_format('harvest_status',      data.substring(24, 32)));
  fields.push(decode_data_format('prev_current1',       data.substring(32, 40)));
  fields.push(decode_data_format('prev_current2',       data.substring(40, 48)));
  fields.push(decode_data_format('prev_harvest_status', data.substring(48, 56)));
  return fields;
}

function read_Vibration_Velocity(data: string) {
  let fields = [];
  fields.push(decode_data_format('freq1',         data.substring(0, 8)));
  fields.push(decode_data_format('acc1',          data.substring(8, 16)));
  fields.push(decode_data_format('freq2',         data.substring(16, 24)));
  fields.push(decode_data_format('acc2',          data.substring(24, 32)));
  fields.push(decode_data_format('acc_rms',       data.substring(32, 40)));
  fields.push(decode_data_format('freq3',         data.substring(40, 48)));
  fields.push(decode_data_format('velo1',         data.substring(48, 56)));
  fields.push(decode_data_format('freq4',         data.substring(56, 64)));
  fields.push(decode_data_format('velo2',         data.substring(64, 72)));
  fields.push(decode_data_format('freq5',         data.substring(72, 80)));
  fields.push(decode_data_format('velo3',         data.substring(80, 88)));
  fields.push(decode_data_format('velo_rms',      data.substring(88, 96)));
  fields.push(decode_data_format('kurtosis',      data.substring(96, 104)));
  fields.push(decode_data_format('surface_temp',  data.substring(104, 112)));
  return fields;
}

function extract_murata_data(data: string) {
  // -- Extract the data portions of the message
  // -- and pass them to the appropriate functions for processing
  const portions = data.split(' ');
  // console.log(portions);
  // -- 1. Check Portion Length
  if (portions.length < 8) {
    return false;
  }
  // -- 2. Check Portion Constants
  if ((portions[0] !== 'ERXDATA') || (portions[2] !== '0000') || (portions[4] !== 'F000')) {
    return false;
  }
  // -- 3. Read Unit ID, Message ID, and RSSI
  const unitid = portions[1];
  const messageid = portions[3];
  let rssi = parseInt(portions[5], 16);
  if (Number.isNaN(rssi)) {
    return false;
  }
  rssi -= 107; // dBm
  // console.log('rssi=', rssi);
  // -- 4. Check Payload length
  const payload_length = parseInt(portions[6], 16);
  if (Number.isNaN(payload_length)) {
    return false;
  }
  // console.log('payload_length=',payload_length);
  if (portions[7].length != (payload_length + 2) ) { // +2 for the CRC
    return false;
  }
  // -- 5. Check Overall CRC
  const crc_all = parseInt(portions[7].slice(-2), 16); // Remove the CRC
  if (Number.isNaN(crc_all)) {
    return false;
  }
  let payload = portions[7].slice(0, -2);
  const text_all = portions.slice(0, 7).join(' ')+' '+payload;
  const crc_all_cal = calculate_crc(text_all);
  if (crc_all != crc_all_cal) {
    return false;
  }
  // console.log('CRC OK');
  // -- 6. Check Payload CRC
  const remainder = payload_length % 8;
  if (remainder == 2) {
    // console.log('Payload length is a multiple of 8 + 2');
    const crc_sub = parseInt(payload.slice(-2), 16); // Remove the CRC
    if (Number.isNaN(crc_sub)) {
      return false;
    }
    payload = payload.slice(0, -2);
    const crc_sub_cal = calculate_crc(payload);
    if (crc_sub != crc_sub_cal) {
      return false;
    }
    // console.log('Payload CRC OK');
  }
  // -- 7. Read Sensor Status
  const sensor_type = payload.substring(4, 6);
  // console.log(`Sensor type: ${sensor_type}`);
  const sensorstate = payload.substring(6, 8);
  // console.log(`Sensor state: ${sensorstate}`);
  const batteryvoltage = parseInt(payload.substring(8, 16), 16) / (SS_CONVERT * 100);
  if (Number.isNaN(batteryvoltage)) {
    return false;
  }
  // console.log(`Battery voltage: ${batteryvoltage.toFixed(2)} V`);
  // -- 8. Read Sensor Data
  let sensortype = '';
  const sensor_data = payload.substring(16);
  let data_chunks = null;
  switch (sensor_type) {
    case '01': // Temperature/Humidity
      sensortype = '1AN';
      console.log('From Temperature/Humidity Sensor');
      break;
    case '10': // Current/Pulse (4-20mA) 
      sensortype = '1MU';
      console.log('From Current/Pulse Sensor');
      break;
    case '13': // Voltage/Pulse (0-5V) 
      sensortype = '1RU';
      console.log('From Voltage/Pulse Sensor');
      break;
    case '12': // CT
      sensortype = '1MT/1NT';
      console.log('From CT Sensor');
      data_chunks = read_CT(sensor_data);
      break;
    case '09': // Vibration（Acceleration）
      sensortype = '1LZ';
      console.log('From Vibration Sensor');
      break;
    case '18': // Vibration（Acceleration/Velocity)
      sensortype = '1TF';
      console.log('From Vibration/Velocity Sensor');
      data_chunks = read_Vibration_Velocity(sensor_data);
      break;
    default:
      // Unknown sensor type
      break;
  }
  return {
    unitid: unitid,
    messageid: messageid,
    rssi: rssi,
    sensortype: sensortype,
    sensorstate: sensorstate,
    batteryvoltage: batteryvoltage,
    data: data_chunks,
  }
}

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  const now = new Date();
  console.error(`[${now.toLocaleString()}] server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  const now = new Date();
  console.log(`[${now.toLocaleString()}] server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  const decoded_data = extract_murata_data(msg.toString());
  console.log(decoded_data);
});

server.on('listening', () => {
  const now = new Date();
  const address = server.address();
  console.log(`[${now.toLocaleString()}] server listening ${address.address}:${address.port}`);
});

server.bind(55061);
// Prints: server listening 0.0.0.0:55062

// *** CLIENT TEST ***
const loop = () => {
  const now = new Date();
  console.log(`[${now.toLocaleString()}] client is running...`);
  // creating a client socket
  var client = dgram.createSocket('udp4');

  //buffer msg
  // var data = Buffer.from('SI\r\n');
  const data = [
    // 'SI',
    // 'XKSREG S0E 1\r\n',
    'ERXDATA 96F6 0000 2885 F000 26 4A 030312FF010A0532067E0007039D0539000105390000006803BF053900010539000000687D0E 96F6 7FFF\r\n',
    'ERXDATA 101E 0000 7734 F000 1F 82 03031800015C0532000500260006050C001900260003050C001305630019002600180572000F0026000E0572002D002600090572001B0574016905661D87052A7B08 101E 7FFF\r\n',
  ];
  const r = Math.random();
  const i = Math.round(r);
  //sending msg
  const msg = data[i];
  client.send(msg, 55062, 'localhost', function(error) {
    if(error){
      client.close();
    }else{
      console.log(`[${msg}] Message sent`);
    }
  });
  setTimeout(loop, 5000);
}

loop();
