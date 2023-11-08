import hello from "./modules/hello";

import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

new AirDatepicker('#date', {
    selectedDates: [new Date()]
})

console.log("Hello performance testing webpack", hello);
