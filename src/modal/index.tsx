export type PaginatedModal = {
    _id: string,
    img: string,
    name: string,
    quantity: number,
    createdDate: any,
}

export interface OptionType {
    value: string;
    label: string;
    key: string;
    icon: any;
    unsigned: string,
}

type OptionTypeOption = {
    id: number;
    label: string;
    children: OptionType[]; // Mảng chứa các đối tượng cùng kiểu OptionType
};


export type NestedArray = OptionTypeOption[];


export interface ListSegmentType {
    Airline: string,
    AllowanceBaggage: string,
    Cabin: string,
    Class: string,
    HandBaggage: string,
    Plane: string
}
export interface BookingType {
    TotalPriceInf: number;
    TotalPriceAdt: number;
    TotalPriceChd: number;
    key: number,
    Id: string,
    FlightNumber: string,
    StartDate: string,
    StartTime: string,
    AirlineOperating: string,
    Adt: number,
    Chd: number,
    Inf: number,
    EndDate: string,
    EndTime: string,
    Currency: string,
    StartPoint: string,
    EndPoint: string,
    FareAdt: number,
    FareChd: number,
    FareInf: number,
    TotalFeeTaxAdt: number,
    TotalFeeTaxChd: number,
    TotalFeeTaxInf: number,
    ListSegment: ListSegmentType[]
}
