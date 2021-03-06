import React, { useEffect, useState } from 'react';
import {Modal, Carousel, ModalBody} from 'react-bootstrap';
import api from '../../api';

export default function GallerySlideShow(props) {
    const [index, setIndex] = useState(props.index); // Index represents which image was clicked on from the gallery section in the parent component (ShowBarber.js) (the clicked on image is the first image that appears in the carousel)
    const [openForm, setOpenForm] = useState(true);
    const [galleryInfo, setGalleryInfo] = useState([]);
    const handleClose = () => {
        setOpenForm(false); // To be able to close the form after opening it
        props.setShow(false); // Setting show to false to update it in the parent's component (ShowBarber.js)
    }

    useEffect(() => {
        getGalleryInfo();
    }, [])

    function getGalleryInfo() {
        api.getBarberGallery(props.info)
        .then(response => {
            setGalleryInfo(response.data);
        })
    }

    function handleSelect(selectedIndex, e){
        setIndex(selectedIndex); // To change from one picture to another when clicking on the right and left arrows on the Carousel
    }

    return (
        <Modal show={openForm ? props.props : false} onHide={() => handleClose()} >
            <Carousel style={{ width:'500px' }} activeIndex={index} onSelect={handleSelect}>
                {galleryInfo.map((photo, index) => {
                    return(
                        <Carousel.Item key={index}>
                            <img
                            className="d-block w-100"
                            width="1000px"
                            height="500px"
                            src={photo.image}
                            />
                        </Carousel.Item>
                    )}
                )}
            </Carousel>
        </Modal>
    );
}
