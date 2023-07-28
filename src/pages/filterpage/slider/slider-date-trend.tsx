import React, { useEffect, useRef, useState } from 'react'
import './section-popular.css'
import './section-slider.css'
import Slider from 'react-slick';
import { formatNgayThangNam3, formatNgayThangNam4 } from 'utils/custom/custom-format';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function SampleNextArrow(props: any) {
    const { onClick } = props;
    return (
        <div
            className="slider-action next section"
            onClick={onClick}
        >
            {">"}
        </div>
    );
}
function SamplePrevArrow(props: any) {
    const { onClick } = props;
    return (
        <div
            className="slider-action section prev"
            onClick={onClick}
        >
            {"<"}
        </div>
    );
}

function SliderDateTrend() {

    const history = useNavigate();
    
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const startPoint = searchParams.get('startPoint') ?? '';
    const endPoint = searchParams.get('endPoint') ?? '';
    const returnDate = searchParams.get('returnDate') ?? '';
    const adults = searchParams.get('adults') ?? '';
    const children = searchParams.get('children') ?? '';
    const Inf = searchParams.get('Inf')
    const departDate = searchParams.get('departDate') ?? '';


    const updateUrlWithFilters = (value: string) => {
        const filters = {
            startPoint: String(startPoint),
            endPoint: String(endPoint),
            adults: String(adults),
            children: String(children),
            Inf: String(Inf),
            departDate: value,
            returnDate: returnDate,
            twoWay: 'false'
        };
        const queryParams = new URLSearchParams(filters);
        history(`/filtered?${queryParams.toString()}`);
    };

    const sliderRef = useRef<Slider | null>(null);

    const listTrends = [
        { date: '28072023', price: 3000000, currency: 'VNĐ' },
        { date: '29072023', price: 3000000, currency: 'VNĐ' },
        { date: '30072023', price: 2000000, currency: 'VNĐ' },
        { date: '31072023', price: 1000000, currency: 'VNĐ' },
        { date: '01082023', price: 5000000, currency: 'VNĐ' },
        { date: '02082023', price: 6000000, currency: 'VNĐ' },
    ]

    useEffect(() => {
        const activeItemIndex = listTrends.findIndex((element) => element.date === departDate);
        if (activeItemIndex !== -1 && sliderRef.current) {
            sliderRef.current.slickGoTo(activeItemIndex, true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departDate]);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 5,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        className: 'slider-sport b',
        centerMode: true,
        centerPadding: '16px',
        appendDots: (dots: any) => (
            <div>
                <ul style={{ display: 'none' }}>{dots}</ul>
            </div>
        ),
        responsive: [
            {
                breakpoint: 1165,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    initialSlide: 4
                }
            },
            {
                breakpoint: 1094,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    initialSlide: 3
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    initialSlide: 3
                }
            },
            {
                breakpoint: 745,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 554,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    };

    return (
        <section className='section-lay-page-trend'>
            <div className='container-section'>
                <div className='gr-slider'>
                    <div className="slider-container">
                        <Slider ref={sliderRef} {...settings}>
                            {listTrends.map((element) => {
                                return (
                                    <div className='mcard match-sched-card'>
                                        <div onClick={() => updateUrlWithFilters(element.date)} className={departDate && departDate === element.date ? 'mcard-inner active' : 'mcard-inner'}>
                                            <h3 className="title-trend">{formatNgayThangNam4(element.date)}</h3>
                                            <h3 className="title-trend">{element.price.toLocaleString("vi-VN")} {element.currency}</h3>
                                        </div>
                                    </div>
                                )
                            })}
                        </Slider>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SliderDateTrend