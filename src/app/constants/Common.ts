import Swal from "sweetalert2/dist/sweetalert2.js";
import moment from "moment";

export const showSwal = (error: string) => {
    Swal.fire({
        heightAuto: false,
        icon: "error",
        title: "Oops...",
        text: error,
    });
};

// Convert unix timestamp to local date time with YYYY-MM-DD T HH:mm:ss format
export const convertUnixTimestampToLocalDateTime = (unixTimestamp: any) => {
    // Check if the timestamp is valid
    if (!unixTimestamp) {
        return '';
    }

    // Convert unix timestamp to local date time
    const length = String(unixTimestamp).length;
    let timestampInMilliseconds;

    if (length <= 10) {
        // Seconds to milliseconds
        timestampInMilliseconds = unixTimestamp * 1000;
    } else if (length === 13) {
        // Already in milliseconds
        timestampInMilliseconds = unixTimestamp;
    } else if (length === 16) {
        // Microseconds to milliseconds
        timestampInMilliseconds = Math.floor(unixTimestamp / 1000);
    } else if (length === 19) {
        // Nanoseconds to milliseconds
        timestampInMilliseconds = Math.floor(unixTimestamp / 1e6);
    } else {
        return '';
    }

    return moment(timestampInMilliseconds).format('YYYY-MM-DD T HH:mm:ss');
};

// Convert GMT time to local date time with YYYY-MM-DD T HH:mm:ss format
export const convertGMTToLocalDateTime = (gmtTime: any) => {
    // Check if the timestamp is valid
    if (!gmtTime) {
        return '';
    }

    // Convert GMT time to local time
    const date = new Date(gmtTime);

    // Get the date and time in the local time zone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Format the date and time in the desired format
    return `${year}-${month}-${day} T ${hours}:${minutes}:${seconds}`;
};
