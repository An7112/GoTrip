import React, { useEffect, useState } from 'react'
import { TbLayoutGridRemove } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { setBooking } from 'store/reducers'
import { formatNgayThangNam2, getAirlineLogo, getNumberOfStops } from 'utils/custom/custom-format'
import { dataCountry } from 'utils/data-country'

function MiniBooking() {

    const { booking, tripType } = useSelector((state: any) => state)
    const dispatch = useDispatch()

    const [chuyenDi, setChuyenDi] = useState<any[]>([])
    const [chuyenVe, setChuyenVe] = useState<any[]>([])

    const formatLocationName = (key: string) => {
        const convert: string = dataCountry.find((element) => element.code === key)?.city ?? ''
        return convert
    }

    useEffect(() => {
        if (Array.isArray(booking) && booking.length > 0) {
            const filDataDi = booking.filter(element => element.key === 1) ?? []
            const filDataVe = booking.filter(element => element.key === 2) ?? []
            setChuyenDi(filDataDi)
            setChuyenVe(filDataVe)
        }
    }, [booking])

    useEffect(() => {
        if (tripType === false) {
            setChuyenVe([])
            localStorage.setItem('bookingInf', JSON.stringify(chuyenDi))
        }
    }, [tripType])

    const doiChuyenDi = () => {
        if (Array.isArray(booking) && booking.length > 0) {
            const filDataDi = booking.filter(element => element.key !== 1) ?? []
            setChuyenDi(filDataDi)
            dispatch(setBooking(filDataDi))
            localStorage.setItem('bookingInf', JSON.stringify(filDataDi))
        }
    }

    const doiChuyenVe = () => {
        if (Array.isArray(booking) && booking.length > 0) {
            const filDataVe = booking.filter(element => element.key !== 2) ?? []
            setChuyenVe(filDataVe)
            dispatch(setBooking(filDataVe))
            localStorage.setItem('bookingInf', JSON.stringify(filDataVe))
        }
    }

    return (
        <div className='list-of-trips'>
            {chuyenDi.length > 0
                ?
                <div className='trip-item'>
                    <div className='trip-header'>
                        <div className='trip-header__title'>
                            <h3 className='title'>
                                Chuyến đi
                            </h3>
                        </div>
                        <p className='trip-dsc'>{formatLocationName(chuyenDi[0].StartPoint)} ({chuyenDi[0].StartPoint}) - {formatLocationName(chuyenDi[0].EndPoint)} ({chuyenDi[0].EndPoint})</p>
                        <p className='trip-dsc date'>{formatNgayThangNam2(chuyenDi[0].StartDate)}</p>
                        <p className='trip-dsc convert-trip' onClick={doiChuyenDi}>Đổi chuyến <TbLayoutGridRemove /></p>
                    </div>
                    <div className='frame-item-col'>
                        <div className='item-flex'>
                            {getAirlineLogo(chuyenDi[0].ListSegment[0].Airline, '60px')}
                            <div className='flex-center-item'>
                                <div className='item-col fix-content'>
                                    <h4 className="searchMenu__title text-truncate">{chuyenDi[0].StartTime}</h4>
                                    <p className="filter-item text-truncate">{chuyenDi[0].StartPoint}</p>
                                </div>
                                <div className='item-col'>
                                    <div className='frame-time-line'>
                                        <div className='dot left'></div>
                                        <div className='line'></div>
                                        <div className='dot right'></div>
                                    </div>
                                    <p className='filter-item fix-content'>{getNumberOfStops(chuyenDi[0])}</p>
                                </div>
                                <div className='item-col fix-content'>
                                    <h4 className="searchMenu__title text-truncate">{chuyenDi[0].EndTime}</h4>
                                    <p className="filter-item text-truncate">{chuyenDi[0].EndPoint}</p>
                                </div>
                            </div>
                            <p className="filter-item fix-content">{chuyenDi[0].FlightNumber}</p>
                        </div>
                    </div>
                </div>
                : <div className='trip-item' style={{ opacity: '0.5' }}>
                    <div className='trip-header'>
                        <div className='trip-header__title'>
                            <h3 className='title'>
                                Chuyến đi
                            </h3>
                        </div>
                    </div>
                    <h3 style={
                        {
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#3554d1'
                        }}>
                        Đang chọn chuyến đi
                    </h3>
                </div>
            }
            {chuyenVe.length > 0
                ?
                <div className='trip-item'>
                    <div className='trip-header'>
                        <div className='trip-header__title'>
                            <h3 className='title'>
                                Chuyến về
                            </h3>
                        </div>
                        <p className='trip-dsc'>{formatLocationName(chuyenVe[0].StartPoint)} ({chuyenVe[0].StartPoint}) - {formatLocationName(chuyenVe[0].EndPoint)} ({chuyenVe[0].EndPoint})</p>
                        <p className='trip-dsc date'>{formatNgayThangNam2(chuyenVe[0].StartDate)}</p>
                        <p className='trip-dsc convert-trip' onClick={doiChuyenVe}>Đổi chuyến <TbLayoutGridRemove /></p>
                    </div>
                    <div className='frame-item-col'>
                        <div className='item-flex'>
                            {getAirlineLogo(chuyenVe[0].ListSegment[0].Airline, '60px')}
                            <div className='flex-center-item'>
                                <div className='item-col fix-content'>
                                    <h4 className="searchMenu__title text-truncate">{chuyenVe[0].StartTime}</h4>
                                    <p className="filter-item text-truncate">{chuyenVe[0].StartPoint}</p>
                                </div>
                                <div className='item-col'>
                                    <div className='frame-time-line'>
                                        <div className='dot left'></div>
                                        <div className='line'></div>
                                        <div className='dot right'></div>
                                    </div>
                                    <p className='filter-item fix-content'>{getNumberOfStops(chuyenVe[0])}</p>
                                </div>
                                <div className='item-col fix-content'>
                                    <h4 className="searchMenu__title text-truncate">{chuyenVe[0].EndTime}</h4>
                                    <p className="filter-item text-truncate">{chuyenVe[0].EndPoint}</p>
                                </div>
                            </div>
                            <p className="filter-item fix-content">{chuyenVe[0].FlightNumber}</p>
                        </div>
                    </div>
                </div>
                : <div className='trip-item' style={{ opacity: '0.5' }}>
                    <div className='trip-header'>
                        <div className='trip-header__title'>
                            <h3 className='title'>
                                Chuyến về
                            </h3>
                        </div>
                    </div>
                    <h3 style={
                        {
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#3554d1'
                        }}>
                        Đang chọn chuyến về
                    </h3>
                </div>
            }
        </div>
    )
}

export default MiniBooking