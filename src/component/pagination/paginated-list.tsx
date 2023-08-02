import React, { useState, useMemo, useEffect, useRef } from 'react';
import Pagination from './pagination';
import { GoArrowUpRight } from 'react-icons/go'
import './pagination.css'
import { Button, Drawer, Empty, Skeleton, Tabs, TabsProps, Tooltip } from 'antd';
import { ListSegmentType } from 'modal/index';
import { useDispatch, useSelector } from 'react-redux';
import { setBooking, setOutPage, setSelectedItem } from 'store/reducers';
import { calculateTimeDifference, convertCity, formatDate, formatDayByDate, formatHoursMinutes, formatNgayThangNam2, formatNgayThangNam3, formatNgayThangNam4, formatTimeByDate, getAirlineFullName, getAirlineLogo, getNumberOfStops } from 'utils/custom/custom-format';
import { FaPlaneArrival, FaPlaneDeparture } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { PiWarningCircleThin } from 'react-icons/pi'

interface IProps {
  paginatedData: any[],
  loading: boolean,
  pageRevert: number,
  onNumberChange: any
}

const PaginatedList = (props: IProps) => {

  const { paginatedData, loading, pageRevert, onNumberChange } = props

  const { tripType, selectedItem, listGeoCodeOneTrip, allData, allDataTwo } = useSelector((state: any) => state)

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, _] = useState(30);
  const [visibleDropdowns, setVisibleDropdowns] = useState<any>({});
  const [sliceLoadMore, setSliceLoadMore] = useState([])
  const [open, setOpen] = useState(false)
  const [refresh, setRefresh] = useState(0);
  // const [mapSelectedDetail, setMapSelectedDetail] = useState(null)

  const [openBooking, setOpenBooking] = useState(false)
  const [dataBooking, setDataBooking] = useState<any[]>([])

  const dispatch = useDispatch()

  const existingColumn = 1;
  const paginatedColumn = [];
  for (let i = 0; i < existingColumn; i++) {
    paginatedColumn.push(i);
  }

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [paginatedData]);

  const pagedItems = useMemo(() => {
    const offset = currentPage * itemsPerPage;
    const startIndex = offset;
    const endIndex = offset + itemsPerPage;
    return paginatedData.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, paginatedData]);

  const handleDivClick = (key: any) => {
    setVisibleDropdowns((prevVisibleDropdowns: { [x: string]: any; }) => ({
      ...prevVisibleDropdowns,
      [key]: !prevVisibleDropdowns[key],
    }));
  };


  const handleButtonClick = () => {
    const targetElement = document.getElementById('scroll');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const addNewItem = (item: any) => {
    handleButtonClick()
    setOpen(false)
    localStorage.setItem('outPage', JSON.stringify(true));
    dispatch(setOutPage(1))
    setRefresh(prev => prev + 1)
    if (tripType) {
      if (pageRevert === 2) {
        onNumberChange(1);
      } else {
        onNumberChange(2);
      }
      let bookingInf = JSON.parse(localStorage.getItem('bookingInf') || '[]');

      const existingItemIndex = bookingInf.findIndex((element: any) => element.key === item.key);

      if (existingItemIndex !== -1) {
        bookingInf.splice(existingItemIndex, 1, item);
      } else {
        if (bookingInf.length === 2) {
          bookingInf.pop();
        }
        if (item.key === 1) {
          bookingInf.unshift(item);
        } else {
          bookingInf.push(item);
        }
      }
      setDataBooking(bookingInf)
      localStorage.setItem('bookingInf', JSON.stringify(bookingInf));
      dispatch(setBooking(bookingInf))
    } else {
      let bookingInf = JSON.parse(localStorage.getItem('bookingInf') || '[]');
      if (bookingInf.length === 0 || bookingInf[0].Id !== item.Id) {
        setDataBooking([item])
        localStorage.setItem('bookingInf', JSON.stringify([item]));
        dispatch(setBooking([item]))
      }
    }
  };

  function formatNumber(number: number) {
    const roundedNumber = Math.ceil(number / 1000) * 1000;
    const formattedNumber = new Intl.NumberFormat('vi-VN').format(roundedNumber);

    return formattedNumber;
  }

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = (item: any) => {
    setOpen(true)
    dispatch(setSelectedItem(item))
  }

  const onCloseBooking = () => {
    setOpenBooking(false);
  };


  useEffect(() => {
    const existingTripType = tripType
    if (existingTripType === true && dataBooking.length === 2) {
      setOpenBooking(true)
    }
  }, [tripType, dispatch, dataBooking, refresh])

  useEffect(() => {
    const newData: any = paginatedData.slice(0, itemsPerPage)
    setSliceLoadMore(newData)
  }, [itemsPerPage, paginatedData])

  const flattenListAircraft = (response: any) => {
    if (response.ListAircraft && Array.isArray(response.ListAircraft)) {
      return response.ListAircraft;
    }
    return [];
  };

  const flatData = [...allData, ...allDataTwo].flatMap((response: any) => flattenListAircraft(response)) ?? []

  const uniqueSet = new Set(flatData.map((item: any) => JSON.stringify(item)));
  const uniqueArray = Array.from(uniqueSet).map((item: any) => JSON.parse(item));

  const getTypePlaneMap = (item: any) => {
    const typePlane = item && uniqueArray.length > 0
      ? uniqueArray.find((element: any) => element.IATA === item.ListSegment[0].Plane)?.Manufacturer
      : '';
    return typePlane
  }


  const getAirPortName = (item: any, key: string) => {
    if (key === 'start') {
      const airportNameStart = listGeoCodeOneTrip.length > 0 && listGeoCodeOneTrip.find((element: any) => element.AirportCode === item.StartPoint).AirportName
      return airportNameStart
    } else {
      const airportNameEnd = listGeoCodeOneTrip.length > 0 && listGeoCodeOneTrip.find((element: any) => element.AirportCode === item.EndPoint).AirportName
      return airportNameEnd
    }
  }

  console.log(pagedItems)

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Chi tiết chuyến bay`,
      children: <>
        {selectedItem
          &&
          <div className='tab-item-flex-col'>
            <div className='tab-item-row'>
              <span className='trip-type'>{pageRevert === 1 ? 'Chuyến đi' : 'Chuyến về'}</span>
              <span className='text-15'>Nonstop</span>
            </div>
            <div className='tab-item-row'>
              <span className='gr-flex'>
                {getAirlineLogo(selectedItem.airline, '60px')}
                {getAirlineFullName(selectedItem.airline)}
              </span>
              <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                <span className='text-15'>Chuyến bay: <strong>{selectedItem.listFlight[0].flightNumber}</strong> </span>
                {/* <span className='text-15'>Loại máy bay: <strong>{getTypePlaneMap(selectedItem)} {selectedItem.listSegment[0].Plane}</strong> </span> */}
                <span className='text-15'>Hạng ghế: <strong>{selectedItem.listFlight[0].groupClass}</strong> </span>
              </span>
            </div>
            <div className='tab-item-row'>
              <div className='row-plane-trip'>
                <div className='timeline-plane'>
                  <FaPlaneDeparture />
                  <div className='line-frame'>
                    <div className='dot'></div>
                    <div className='line'></div>
                    <div className='dot bottom'></div>
                  </div>
                  <FaPlaneArrival />
                </div>
              </div>
              <div className='plane-trip-inf'>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-15'><strong>{formatTimeByDate(selectedItem.listFlight[0].startDate)}</strong> </span>
                    <span className='text-15'>{formatDayByDate(selectedItem.listFlight[0].startDate)}</span>
                  </span>
                  <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                    <span className='text-15'>{selectedItem.listFlight[0].startPointName} ({selectedItem && selectedItem.listFlight[0].startPoint})</span>
                    <span className='text-14' style={{ color: '#9b9b9b' }}>{getAirPortName(selectedItem, 'start')}</span>
                  </span>
                </div>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    {/* <span className='text-14' style={{ color: '#3554d1' }}>Thời gian bay {selectedItem.DurationFormat}</span> */}
                    <span className='text-14' style={{ color: '#3554d1' }}>Thời gian bay {calculateTimeDifference(selectedItem.listFlight[0].endDate, selectedItem.listFlight[0].startDate)}</span>
                  </span>
                </div>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-15'><strong>{formatTimeByDate(selectedItem.listFlight[0].endDate)}</strong> </span>
                    <span className='text-15'>{formatDayByDate(selectedItem.listFlight[0].endDate)}</span>
                  </span>
                  <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                    <span className='text-15'>{selectedItem.listFlight[0].endPointName} ({selectedItem && selectedItem.listFlight[0].endPoint})</span>
                    <span className='text-14' style={{ color: '#9b9b9b' }}>{getAirPortName(selectedItem, 'end')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      </>,
    },
    {
      key: '2',
      label: `Hành lý & điều kiện vé`,
      children: `Điều kiện`,
    },
  ];

  console.log(dataBooking)
  const Bookingitems: TabsProps['items'] = dataBooking.map((element, index) => (
    {
      key: String(index),
      label: `Chuyến ${dataBooking.length > 0 && index === 0 ? `đi` : 'về'}`,
      children: (
        <>
          <div className='tab-item-flex-col'>
            <h3 className='title-drawer'>
              {convertCity(element.StartPoint)} ({element.StartPoint}) - {convertCity(element.EndPoint)} ({element.EndPoint})
            </h3>
            <div className='tab-item-row'>
              <span className='trip-type'>{element.FlightNumber}</span>
              <span className='text-15'>Nonstop</span>
            </div>
            <div className='tab-item-row'>
              <span className='gr-flex'>
                {getAirlineLogo(element.AirlineOperating, '60px')}
                {getAirlineFullName(element.AirlineOperating)}
              </span>
              <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                <span className='text-15'>Chuyến bay: <strong>{element.FlightNumber}</strong> </span>
                {/* <span className='text-15'>Loại máy bay: <strong>{getTypePlaneMap(element)} {element.ListSegment[0]?.Plane}</strong> </span> */}
                <span className='text-15'>Hạng ghế: <strong>{element.ListSegment[0].Cabin}</strong></span>
              </span>
            </div>
            <div className='tab-item-row'>
              <div className='row-plane-trip'>
                <div className='timeline-plane'>
                  <FaPlaneDeparture />
                  <div className='line-frame'>
                    <div className='dot'></div>
                    <div className='line'></div>
                    <div className='dot bottom'></div>
                  </div>
                  <FaPlaneArrival />
                </div>
              </div>
              <div className='plane-trip-inf'>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-15'><strong>{element.StartTime}</strong> </span>
                    <span className='text-15'>{formatNgayThangNam3(element.StartDate)}</span>
                  </span>
                  <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                    <span className='text-15'>{convertCity(element.StartPoint)} ({element.StartPoint})</span>
                    <span className='text-14' style={{ color: '#9b9b9b' }}>{getAirPortName(element, 'start')}</span>
                  </span>
                </div>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-14' style={{ color: '#3554d1' }}>Thời gian bay {element.DurationFormat}</span>
                  </span>
                </div>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-15'><strong>{element.EndTime}</strong> </span>
                    <span className='text-15'>{formatNgayThangNam3(element.EndDate)}</span>
                  </span>
                  <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                    <span className='text-15'>{convertCity(element.EndPoint)} ({element.EndPoint})</span>
                    <span className='text-14' style={{ color: '#9b9b9b' }}>{getAirPortName(element, 'end')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    }
  ));

  function formatNumberAs(number: number) {
    return Math.ceil(number / 1000) * 1000;
  }

  const total = dataBooking.reduce((num, cur) =>
    num +=
    (cur.TotalPriceAdt * cur.Adt + cur.TotalPriceChd * cur.Chd + cur.TotalPriceInf * cur.Inf)
    , 0)

  const totalAdt = dataBooking.reduce((num, cur) =>
    num +=
    (cur.TotalPriceAdt * cur.Adt)
    , 0)

  const totalChd = dataBooking.reduce((num, cur) =>
    num +=
    (cur.TotalPriceChd * cur.Chd)
    , 0)

  const totalInf = dataBooking.reduce((num, cur) =>
    num +=
    (cur.TotalPriceInf * cur.Inf)
    , 0)

    console.log(dataBooking)

  return (
    <>
      <Drawer
        className='drawer-class-paginated'
        placement={'right'}
        closable={true}
        onClose={onClose}
        width={'fit-content'}
        open={open}
        footer={<div className='tab-footer'>

          <Tooltip color='white' placement="topLeft" title={
            <div className='tooltip-content'>
              {selectedItem && selectedItem.adt > 0
                && <div className='content-flex-row'>
                  <span className='text-13'>Vé người lớn x {selectedItem && selectedItem.adt}</span>
                  <span className='text-13'>{selectedItem
                    && formatNumber((
                      selectedItem.fareAdt + selectedItem.feeAdt + selectedItem.taxAdt + selectedItem.serviceFeeAdt))}
                    {selectedItem && selectedItem.currency}</span>
                </div>
              }
              {selectedItem && selectedItem.chd > 0
                && <div className='content-flex-row'>
                  <span className='text-13'>Vé trẻ em x {selectedItem && selectedItem.chd}</span>
                  <span className='text-13'>{selectedItem 
                  && formatNumber((
                    selectedItem.fareChd + selectedItem.feeChd + selectedItem.taxChd + selectedItem.serviceFeeChd))}
                    {selectedItem && selectedItem.currency}</span>
                </div>
              }
              {selectedItem && selectedItem.inf > 0
                && <div className='content-flex-row'>
                  <span className='text-13'>Vé em bé x {selectedItem && selectedItem.inf}</span>
                  <span className='text-13'>{selectedItem 
                  && formatNumber((selectedItem.fareInf + selectedItem.feeInf + selectedItem.taxInf + selectedItem.serviceFeeInf))} 
                  {selectedItem && selectedItem.currency}</span>
                </div>
              }
            </div>
          }>
            <span className='gr-flex'>
              <span className='text-15' style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                fontWeight: '400',
                gap: '8px'
              }}>Tổng chi phí tạm tính  <PiWarningCircleThin /></span>
              <span className='text-13' style={{ color: '#9b9b9b' }}>(Đã bao gồm Thuế và phí)</span>
            </span>
          </Tooltip>
          <span className='text-15' style={{ fontWeight: '500' }}>{selectedItem && formatNumber(selectedItem.fullPrice)} {selectedItem && (selectedItem.currency ?? 'VNĐ')}</span>
          {selectedItem && tripType === true
            ? <button className={'view-deal'} onClick={() => addNewItem({
              key: pageRevert,
              Id: selectedItem.bookingKey,
              Airline: selectedItem.airline,
              Adt: selectedItem.adt,
              Chd: selectedItem.chd,
              AirlineOperating: selectedItem.airline,
              Inf: selectedItem.inf,
              Currency: selectedItem.currency ?? 'VNĐ',
              EndDate: formatDate(selectedItem.listFlight[0].endDate),
              EndPoint: selectedItem.listFlight[0].endPoint,
              DurationFormat: formatHoursMinutes(selectedItem.listFlight[0].duration),
              TotalPriceAdt: selectedItem.fareAdt + selectedItem.feeAdt + selectedItem.taxAdt + selectedItem.serviceFeeAdt,
              TotalPriceChd: selectedItem.fareChd + selectedItem.feeChd + selectedItem.taxChd + selectedItem.serviceFeeChd,
              TotalPriceInf: selectedItem.fareInf + selectedItem.feeInf + selectedItem.taxInf + selectedItem.serviceFeeInf,
              EndTime: formatTimeByDate(selectedItem.listFlight[0].endDate),
              FlightNumber: selectedItem.listFlight[0].flightNumber,
              ListSegment: selectedItem.listFlight[0].listSegment.map((item: any) => {
                return {
                  Airline: item.airline,
                  AllowanceBaggage: item.allowanceBaggage ?? 0,
                  Cabin: selectedItem.listFlight[0].groupClass,
                  Plane: item.plane,
                  Class: item.class,
                  HandBaggage: item.handBaggage
                }
              }),
              StartDate: formatDate(selectedItem.listFlight[0].startDate),
              StartPoint: selectedItem.listFlight[0].startPoint,
              StartTime: formatTimeByDate(selectedItem.listFlight[0].startDate),
              FareAdt: selectedItem.fareAdt,
              FareChd: selectedItem.fareChd,
              FareInf: selectedItem.fareInf,
              TotalFeeTaxAdt: selectedItem.feeAdt,
              TotalFeeTaxChd: selectedItem.feeChd,
              TotalFeeTaxInf: selectedItem.feeInf,
            })}>
              Chọn
              <GoArrowUpRight />
            </button>
            : <Link to={'/booking'}>
              <button className={'view-deal'} onClick={() => addNewItem({
                key: pageRevert,
                Id: selectedItem.bookingKey,
                Airline: selectedItem.airline,
                Adt: selectedItem.adt,
                Chd: selectedItem.chd,
                AirlineOperating: selectedItem.airline,
                Inf: selectedItem.inf,
                Currency: selectedItem.currency ?? 'VNĐ',
                EndDate: formatDate(selectedItem.listFlight[0].endDate),
                DurationFormat: formatHoursMinutes(selectedItem.listFlight[0].duration),
                EndPoint: selectedItem.listFlight[0].endPoint,
                TotalPriceAdt: selectedItem.fareAdt + selectedItem.feeAdt + selectedItem.taxAdt + selectedItem.serviceFeeAdt,
                TotalPriceChd: selectedItem.fareChd + selectedItem.feeChd + selectedItem.taxChd + selectedItem.serviceFeeChd,
                TotalPriceInf: selectedItem.fareInf + selectedItem.feeInf + selectedItem.taxInf + selectedItem.serviceFeeInf,
                EndTime: formatTimeByDate(selectedItem.listFlight[0].endDate),
                FlightNumber: selectedItem.listFlight[0].flightNumber,
                ListSegment: selectedItem.listFlight[0].listSegment.map((item: any) => {
                  return {
                    Airline: item.airline,
                    AllowanceBaggage: item.allowanceBaggage ?? 0,
                    Cabin: selectedItem.listFlight[0].groupClass,
                    Plane: item.plane,
                    Class: item.class,
                    HandBaggage: item.handBaggage
                  }
                }),
                StartDate: formatDate(selectedItem.listFlight[0].startDate),
                StartPoint: selectedItem.listFlight[0].startPoint,
                StartTime: formatTimeByDate(selectedItem.listFlight[0].startDate),
                FareAdt: selectedItem.fareAdt,
                FareChd: selectedItem.fareChd,
                FareInf: selectedItem.fareInf,
                TotalFeeTaxAdt: selectedItem.feeAdt,
                TotalFeeTaxChd: selectedItem.feeChd,
                TotalFeeTaxInf: selectedItem.feeInf,
              })}>
                Chọn
                <GoArrowUpRight />
              </button>
            </Link>
          }
        </div>}
      >
        <div className='flex-col'>
          <h3 className='title-drawer'>
            {selectedItem && selectedItem.listFlight[0].startPointName} ({selectedItem && selectedItem.listFlight[0].startPoint}) - {selectedItem && selectedItem.listFlight[0].endPointName} ({selectedItem && selectedItem.listFlight[0].endPoint})
          </h3>
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      </Drawer>
      <Drawer
        className='drawer-class-paginated'
        placement={'right'}
        closable={true}
        onClose={onCloseBooking}
        width={'fit-content'}
        open={openBooking}
        footer={<div className='tab-footer'>

          <Tooltip color='white' placement="topLeft" title={
            <div className='tooltip-content'>
              {dataBooking.length > 0 && dataBooking[0].Adt > 0
                && <div className='content-flex-row'>
                  <span className='text-13'>Vé người lớn x {dataBooking[0].Adt}</span>
                  <span className='text-13'>{formatNumber(totalAdt)} {dataBooking[0].Currency}</span>
                </div>
              }
              {dataBooking.length > 0 && dataBooking[0].Chd > 0
                && <div className='content-flex-row'>
                  <span className='text-13'>Vé trẻ em x {dataBooking[0].Chd}</span>
                  <span className='text-13'>{formatNumber(totalChd)} {dataBooking[0].Currency}</span>
                </div>
              }
              {dataBooking.length > 0 && dataBooking[0].Inf > 0
                && <div className='content-flex-row'>
                  <span className='text-13'>Vé em bé x {dataBooking[0].Inf}</span>
                  <span className='text-13'>{formatNumber(totalInf)} {dataBooking[0].Currency}</span>
                </div>
              }
            </div>
          }>
            <span className='gr-flex'>
              <span className='text-15' style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                fontWeight: '400',
                gap: '8px'
              }}>Tổng chi phí tạm tính  <PiWarningCircleThin /></span>
              <span className='text-13' style={{ color: '#9b9b9b' }}>(Đã bao gồm Thuế và phí)</span>
            </span>
          </Tooltip>
          <span className='text-15' style={{ fontWeight: '500' }}>{total.toLocaleString("vi-VN")} VNĐ</span>
          <Link to={'/booking'}>
            <button className='continue'>Tiếp tục</button>
          </Link>
        </div>}
      >
        <div className='flex-col'>
          <Tabs defaultActiveKey="1" items={Bookingitems} />
        </div>
      </Drawer>
      <div className='paginated-main'>
        <div className='paginated-row grid-container'>
          {loading
            ? <Skeleton avatar paragraph={{ rows: 4 }} style={{ gridColumn: 'span 2 / span 2' }} active />
            : pagedItems.length > 0 ? pagedItems
              .map((element: any, index: number) => {
                // const isActive = bookingInf.some((ele) => String(ele.Id) === String(element.Id))
                return (
                  <div className='paginated-item items' key={`element_${index}`}>
                    <div className='frame-item-col'>
                      <div className='item-flex' onClick={() => handleDivClick(index)}>
                        {getAirlineLogo(element.airline, '60px')}
                        <div className='flex-center-item'>
                          <div className='item-col fix-content'>
                            <h4 className="searchMenu__title text-truncate">{formatTimeByDate(element.listFlight[0].startDate)}</h4>
                            <p className="filter-item text-truncate">{element.listFlight[0].startPoint}</p>
                          </div>
                          <div className='item-col'>
                            <div className='frame-time-line'>
                              <div className='dot left'></div>
                              <div className='line'></div>
                              <div className='dot right'></div>
                            </div>
                            <p className='filter-item fix-content'>{getNumberOfStops(element)}</p>
                          </div>
                          <div className='item-col fix-content'>
                            <h4 className="searchMenu__title text-truncate">{formatTimeByDate(element.listFlight[0].endDate)}</h4>
                            <p className="filter-item text-truncate">{element.listFlight[0].endPoint}</p>
                          </div>
                        </div>
                        <p className="filter-item fix-content">{element.listFlight[0].flightNumber}</p>
                      </div>
                      <Button className='detail' style={{ maxWidth: 'fit-content' }} onClick={() => onOpen(element)}>Chi tiết</Button>
                    </div>
                    <div className='item-col-1'>
                      <h3 className='text-18 text-truncate'>{formatNumber(element.fullPrice)} {element.Currency ?? 'VNĐ'}</h3>
                      {/* <p className="filter-item text-truncate">16 deals</p> */}
                      {tripType === true
                        ? <button className={'view-deal'} onClick={() => addNewItem({
                          key: pageRevert,
                          Id: element.bookingKey,
                          Airline: element.airline,
                          Adt: element.adt,
                          Chd: element.chd,
                          AirlineOperating: element.airline,
                          Inf: element.inf,
                          Currency: element.currency ?? 'VNĐ',
                          EndDate: formatDate(element.listFlight[0].endDate),
                          DurationFormat: formatHoursMinutes(element.listFlight[0].duration),
                          EndPoint: element.listFlight[0].endPoint,
                          EndTime: formatTimeByDate(element.listFlight[0].endDate),
                          TotalPriceAdt: element.fareAdt + element.feeAdt + element.taxAdt + element.serviceFeeAdt,
                          TotalPriceChd: element.fareChd + element.feeChd + element.taxChd + element.serviceFeeChd,
                          TotalPriceInf: element.fareInf + element.feeInf + element.taxInf + element.serviceFeeInf,
                          FlightNumber: element.listFlight[0].flightNumber,
                          ListSegment: element.listFlight[0].listSegment.map((item: any) => {
                            return {
                              Airline: item.airline,
                              AllowanceBaggage: item.allowanceBaggage ?? 0,
                              Cabin: element.listFlight[0].groupClass,
                              Plane: item.plane,
                              Class: item.class,
                              HandBaggage: item.handBaggage
                            }
                          }),
                          StartDate: formatDate(element.listFlight[0].startDate),
                          StartPoint: element.listFlight[0].startPoint,
                          StartTime: formatTimeByDate(element.listFlight[0].startDate),
                          FareAdt: element.fareAdt,
                          FareChd: element.fareChd,
                          FareInf: element.fareInf,
                          TotalFeeTaxAdt: element.feeAdt,
                          TotalFeeTaxChd: element.feeChd,
                          TotalFeeTaxInf: element.feeInf,
                        })}>
                          Chọn
                          <GoArrowUpRight />
                        </button>
                        : <Link to={'/booking'}>
                          <button className={'view-deal'} onClick={() => addNewItem({
                            key: pageRevert,
                            Id: element.bookingKey,
                            Airline: element.airline,
                            Adt: element.adt,
                            Chd: element.chd,
                            AirlineOperating: element.airline,
                            Inf: element.inf,
                            Currency: element.currency ?? 'VNĐ',
                            EndDate: formatDate(element.listFlight[0].endDate),
                            EndPoint: element.listFlight[0].endPoint,
                            DurationFormat: formatHoursMinutes(element.listFlight[0].duration),
                            EndTime: formatTimeByDate(element.listFlight[0].endDate),
                            TotalPriceAdt: element.fareAdt + element.feeAdt + element.taxAdt + element.serviceFeeAdt,
                            TotalPriceChd: element.fareChd + element.feeChd + element.taxChd + element.serviceFeeChd,
                            TotalPriceInf: element.fareInf + element.feeInf + element.taxInf + element.serviceFeeInf,
                            FlightNumber: element.listFlight[0].flightNumber,
                            ListSegment: element.listFlight[0].listSegment.map((item: any) => {
                              return {
                                Airline: item.airline,
                                AllowanceBaggage: item.allowanceBaggage ?? 0,
                                Cabin: element.listFlight[0].groupClass,
                                Plane: item.plane,
                                Class: item.class,
                                HandBaggage: item.handBaggage
                              }
                            }),
                            StartDate: formatDate(element.listFlight[0].startDate),
                            StartPoint: element.listFlight[0].startPoint,
                            StartTime: formatTimeByDate(element.listFlight[0].startDate),
                            FareAdt: element.fareAdt,
                            FareChd: element.fareChd,
                            FareInf: element.fareInf,
                            TotalFeeTaxAdt: element.feeAdt,
                            TotalFeeTaxChd: element.feeChd,
                            TotalFeeTaxInf: element.feeInf,
                          })}>
                            Chọn
                            <GoArrowUpRight />
                          </button>
                        </Link>
                      }

                    </div>
                  </div>
                )
              })
              : <Empty description={'Không tìm thấy chuyến bay bạn yêu cầu.'} style={{ gridColumn: 'span 2 / span 2' }} />
          }
        </div>
      </div>
      <Pagination
        pageCount={Math.ceil(paginatedData.length / itemsPerPage)}
        onPageChange={handlePageChange}
        initialPage={currentPage}
      />
    </>
  );
};
export default PaginatedList;
