import Swal from "sweetalert2/dist/sweetalert2.js";

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
    // Check if the unixTimestamp length is 10 digits
    if (unixTimestamp.toString().length === 10) {
        unixTimestamp = unixTimestamp * 1000000;
    }

    // Convert from microseconds to milliseconds by dividing by 1,000
    const date = new Date(unixTimestamp / 1000);

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

