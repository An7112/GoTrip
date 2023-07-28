import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
const departDate = searchParams.get('departDate') ?? '';
const returnDate = searchParams.get('returnDate') ?? '';

interface TypeGeoCode {
    AirportCode: string,
    AirportName: string,
    CityCode: string,
    CityName: string,
    CountryCode: string,
    CountryName: string,
}

export interface BookingType {
    booking: any[],
    tripType: boolean,
    outPage: number,
    selectedItem: null,
    listGeoCodeOneTrip: TypeGeoCode[],
    listGeoCodeTwoTrip: TypeGeoCode[],
    allData: any[],
    allDataTwo: any[],
    dateTrendActive: string,
}

const initialState: BookingType = {
    booking: [],
    tripType: false,
    outPage: 0,
    selectedItem: null,
    listGeoCodeOneTrip: [],
    listGeoCodeTwoTrip: [],
    allData: [],
    allDataTwo: [],
    dateTrendActive: departDate,
}

const bookingSlice = createSlice({
    name: 'gotrip',
    initialState,
    reducers: {
        setBooking: (state, action: PayloadAction<any[]>) => {
            state.booking = action.payload
        },
        setTripType: (state, action: PayloadAction<boolean>) => {
            state.tripType = action.payload
        },
        setOutPage: (state, action: PayloadAction<number>) => {
            state.outPage += action.payload
        },
        setSelectedItem: (state, action: PayloadAction<null>) => {
            state.selectedItem = action.payload
        },
        setListGeoCodeOneTrip: (state, action: PayloadAction<TypeGeoCode[]>) => {
            state.listGeoCodeOneTrip = action.payload
        },
        setListGeoCodeTwoTrip: (state, action: PayloadAction<TypeGeoCode[]>) => {
            state.listGeoCodeTwoTrip = action.payload
        },
        setDateTrendActive: (state, action: PayloadAction<string>) => {
            state.dateTrendActive = action.payload
        },
        setAllData: (state, action: PayloadAction<any[]>) => {
            state.allData = action.payload
        },
        setAllDataTwo: (state, action: PayloadAction<any[]>) => {
            state.allDataTwo = action.payload
        },
    }
})

export const {
    setBooking,
    setTripType,
    setOutPage,
    setSelectedItem,
    setListGeoCodeOneTrip,
    setListGeoCodeTwoTrip,
    setDateTrendActive,
    setAllData,
    setAllDataTwo,
} = bookingSlice.actions;

export default bookingSlice.reducer;
