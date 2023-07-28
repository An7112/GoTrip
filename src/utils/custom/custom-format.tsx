import dayjs from "dayjs";
import { dataCountry } from "utils/data-country";
dayjs.locale('vi')

export const getAirlineLogo = (abbr: string, style: string) => {
    switch (abbr) {
        case 'VJ':
            return <img style={{ width: style, height: style }} className='paginated-item-img' src='media/logo/vietjetair.jpg' alt='vj' />;
        case 'VN':
            return <img style={{ width: style, height: style }} className='paginated-item-img' src='media/logo/vietnamairlines.png' alt='vn' />;
        case 'QH':
            return <img style={{ width: style, height: style }} className='paginated-item-img' src='media/logo/bamboo.png' alt='qh' />;
        case 'VU':
            return <img style={{ width: style, height: style }} className='paginated-item-img' src='media/logo/vietravel.png' alt='vu' />;
        default:
            return <img style={{ width: style, height: style }} className='paginated-item-img' alt={abbr} />;
    }
};

export const getNumberOfStops = (item: any) => {
    const numSegments = item.ListSegment.length;
    if (numSegments > 1) {
        return `${numSegments - 1} Stops`;
    } else {
        return 'Nonstop';
    }
};

export const formatNgayThangNam = (day: string) => {
    const formattedDate = dayjs(day, 'DD-MM-YYYY')
        .format('dddd, [ngày] DD [tháng] M [năm] YYYY')
        .replace(/\b\w/, (char) => char.toUpperCase());
    return formattedDate
}

export const formatNgayThangNam2 = (day: string) => {
    const formattedDate = dayjs(day, 'DD-MM-YYYY')
        .format('dddd, DD/MM/YYYY')
        .replace(/\b\w/, (char) => char.toUpperCase());
    return formattedDate
}

export const formatNgayThangNam3 = (day: string) => {
    const dateObj = dayjs(day, 'DDMMYYYY');
    const dayOfWeekName = dateObj.format('dddd');
    const dayOfMonth = dateObj.format('DD');
    const month = dateObj.format('MM');
    const year = dateObj.format('YYYY');
    const formattedDate = `${dayOfWeekName}, ${dayOfMonth}/${month}/${year}`;
    if (formattedDate === 'Invalid Date, Invalid Date/Invalid Date/Invalid Date') {
        return null
    } else {
        return formattedDate.replace(/\b\w/, (char) => char.toUpperCase())
    }
}

export const convertCity = (code: string) => {
    const convert = dataCountry.find((element) => element.code === code)?.city ?? ''
    return convert
}

export const getAirlineFullName = (abbr: string) => {
    switch (abbr) {
        case 'VJ':
            return 'Vietjet Air';
        case 'VN':
            return 'Vietnam Airlines';
        case 'QH':
            return 'Bamboo Airways';
        case 'VU':
            return 'Vietravel';
        default:
            return abbr;
    }
};