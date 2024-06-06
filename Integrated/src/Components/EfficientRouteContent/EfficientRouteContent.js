import React, { useEffect, useState, useRef } from 'react';
import './EfficientRouteContent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import { fetchImage } from '../../pexelsApi'; 

const storeData = [
    {
        name: 'Auchan',
        imgSrc: "img/auchan.jpg",
        address: 'Palas Mall, Strada Palas 5C, Iasi 700051',
    },
    {
        name: 'Kaufland',
        imgSrc: "img/kaufland.jpg",
        address: 'Iasi-Alexandru cel Bun',
    },
    {
        name: 'Dedeman',
        imgSrc: "img/dedeman.jpg",
        address: 'Bulevardul Primaverii nr. 2, Iasi 700264',
    },
    {
        name: 'Lidl',
        imgSrc: "img/lidl.jpg",
        address: 'Strada Pantelimon Halipa 3C, Iasi 700612',
    },
    {
        name: 'Penny',
        imgSrc: "img/penny.jpg",
        address: 'Strada Pantelimon Halipa 12A, Iasi 700614',
    },
    {
        name: 'Mega',
        imgSrc: "img/mega.jpg",
        address: 'Strada Cerna 1, Iasi',
    },
    {
        name: 'Profi',
        imgSrc: "img/profi.jpg",
        address: 'Bulevardul Nicolae Iorga nr. 236, Iasi 700721',
    },
];

export const EfficientRouteContent = () => {
    const prevDataRef = useRef(null);
    const [selectedList, setSelectedList] = useState('');
    const [map, setMap] = useState(null);
    const [routeLayerId] = useState('route');
    const [routeSourceId] = useState('route-source');
    const [APIKEY] = useState('NhpffQFVsuEKicglGSJltG2aJr95GNgD');
    const mapId = 'mymap';
    const [markers, setMarkers] = useState([]);
    const [details, setDetails] = useState({
        title: '',
        images: [],
        texts: [],
        altTableContent: [],
        prices: ''
    });
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shoppingLists, setShoppingLists] = useState([]);
   
    useEffect(() => {
        setStores([]);
    }, []);
    
    const [House, setHouse] = useState([27.577771, 47.153566]);

    useEffect(() => {
        const fetchInitialLocation = async () => {
            try {
                const response = await fetch('http://localhost:9091/api/updateLocation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        latitude: House[0],
                        longitude: House[1]
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const locationData = await response.json();
                console.log("Initial location:", locationData);

                setHouse([locationData.latitude, locationData.longitude]);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        };

        fetchInitialLocation();        
    }, []);
    useEffect(() => {
        const fetchShoppingLists = async () => {
            try {
                const response = await fetch('http://localhost:9091/api/lists', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'credentials': 'include' // Include cookies with the request
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                } else {
                    const formattedLists = Object.entries(data).map(([id, name]) => ({
                        id: parseInt(id),
                        name: name
                    }));
                    setShoppingLists(formattedLists);
                    console.log("Shopping Lists:", formattedLists); // Print the data here
                }
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        };

        fetchShoppingLists();
    }, []);

    useEffect(() => {
        const script1 = document.createElement('script');
        script1.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.53.0/maps/maps-web.min.js';
        script1.async = true;
        document.body.appendChild(script1);

        const script2 = document.createElement('script');
        script2.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.53.0/services/services-web.min.js';
        script2.async = true;
        document.body.appendChild(script2);

        return () => {
            document.body.removeChild(script1);
            document.body.removeChild(script2);
        };
    }, []);

    useEffect(() => {
        if (window.tt && window.tt.map) {
            const mapInstance = window.tt.map({
                key: APIKEY,
                container: mapId,
                center: House,
                zoom: 15,
                style: 'tomtom://vector/1/basic-main',
            });
            setMap(mapInstance);
            const iconElement = document.createElement('div');
            const imgElement = document.createElement('img');
            imgElement.src = "img/ico/house_icon.png";
            imgElement.style.width = '45px';
            imgElement.style.height = '45px';
            iconElement.appendChild(imgElement);

            new window.tt.Marker({ element: iconElement }).setLngLat(House).addTo(mapInstance);
        }
    }, [APIKEY, House, mapId]);

    const handleZoomIn = () => {
        if (map) {
            const currentZoom = map.getZoom();
            map.setZoom(currentZoom + 1);
        }
    };

    const handleZoomOut = () => {
        if (map) {
            const currentZoom = map.getZoom();
            map.setZoom(currentZoom - 1);
        }
    };

    useEffect(() => {
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
    
        if (zoomInBtn && zoomOutBtn) {
            zoomInBtn.addEventListener('click', handleZoomIn);
            zoomOutBtn.addEventListener('click', handleZoomOut);
    
            return () => {
                zoomInBtn.removeEventListener('click', handleZoomIn);
                zoomOutBtn.removeEventListener('click', handleZoomOut);
            };
        }
    }, [map]);
    
    
    const fetchData = async () => {
        if (selectedList === '') {
            return;
        }
        setLoading(true);
        console.log("Selected list: ", selectedList);
        try {
            const response = await fetch('http://localhost:9091/api/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedList) 
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log(responseData);
            if (responseData.message) {
                const storeNames = Object.keys(responseData.message).filter(name => name !== 'TOTAL');
                const coordinates = storeNames.map(storeName => responseData.message[storeName].coordinates);

                const waypoints = coordinates.map(coordinate => ({ lnglat: coordinate }));
                waypoints.unshift({ lnglat: House });
                waypoints.push({ lnglat: House });

                const filteredStoreData = await Promise.all(storeNames.map(async (storeName) => {
                    const store = storeData.find(store => store.name === storeName);
                    if (store) {
                        const products = responseData.message[storeName].products;
                        const totalPrice = responseData.message[storeName].totalPrice;
                        const productDetails = await Promise.all(products.map(async (product) => {
                            const imageUrl = await fetchImage(product.name);
                            return {
                                ...product,
                                imageUrl
                            };
                        }));
                        return {
                            ...store,
                            price: `${totalPrice} RON`,
                            details: {
                                ...store.details,
                                images: productDetails.map(product => product.imageUrl),
                                texts: productDetails.map(product => product.name),
                                altTableContent: productDetails.map(product => `${product.price} RON`)
                            }
                        };
                    }
                    return null;
                }));

                filteredStoreData.sort((a, b) => storeNames.indexOf(a.name) - storeNames.indexOf(b.name));
                setStores(filteredStoreData.filter(store => store !== null));
                createRoute(waypoints);
            } else {
                console.error('Message data is null or undefined');
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setLoading(false);
        }
        
    };

    useEffect(() => {
        fetchData();
    }, [selectedList]);

    function isEqual(objA, objB) {
        if (objA === objB) return true;
        if (objA == null || objB == null) return false;
        if (typeof objA !== 'object' || typeof objB !== 'object') return false;
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) return false;

        for (let key of keysA) {
            if (!isEqual(objA[key], objB[key])) return false;
        }
        return true;
    }
    /*ver noua netestata fara request */
    const fetchData_consumption = async () => {
        try {
            const response = await fetch('http://localhost:9091/inventory/infoItemRestock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(-1)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log(responseData);
            console.log('prevData:');
            console.log(prevDataRef.current);
            if (!isEqual(responseData, prevDataRef.current)) {
                prevDataRef.current = responseData;
                console.log('Data changed!');
                console.log(prevDataRef.current);
                const productId = Object.keys(responseData)[0];
                const productName = responseData[productId];
                console.log(productName);
                console.log(productId);
                Notification.requestPermission().then(perm => {
                    if (perm === 'granted') {
                        const notification = new Notification('Sugestie de restock!', {
                            body: `Produsul ${productName} trebuie cumparat in urmatoarele zile!`
                        })
                        notification.onclick = (event) => {
                            event.preventDefault(); 
                            
                            const targetUrl = `http://localhost:3000/#/shopping-list?fromNotification=true&productId=${productId}&productName=${encodeURIComponent(productName)}`;
                            if (!window.location || window.location.href === 'http://localhost:3000/') {
                                window.location.href = targetUrl;
                            } else {
                                window.open(targetUrl, '_blank');
                            }
                        };
                    }
                });
            }

        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
           /* setLoading(false);*/
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            fetchData_consumption();
        }, 10000); // 60000 ms = 1 minut

        return () => clearInterval(interval);
    }, []);

    const createRoute = (waypoints) => {
        if (!map) {
            return;
        }
        markers.forEach(marker => marker.remove());
    
        const routeOptions = {
            key: APIKEY,
            locations: waypoints.map(waypoint => waypoint.lnglat),
            computeBestOrder: false,
            travelMode: 'car'
        };
    
        const newMarkers = waypoints.map(waypoint => {
            if (waypoint.lnglat[0] !== House[0] && waypoint.lnglat[1] !== House[1]) {
                return new window.tt.Marker().setLngLat(waypoint.lnglat).addTo(map);
            }
            return null;
        }).filter(marker => marker !== null);
    
        setMarkers(newMarkers);
    
        if (map.getLayer(routeLayerId)) {
            map.removeLayer(routeLayerId);
        }
    
        if (map.getSource(routeSourceId)) {
            map.removeSource(routeSourceId);
        }
    
        window.tt.services.calculateRoute(routeOptions).go().then(routeData => {
            const geoJSON = routeData.toGeoJson();
            displayRoute(geoJSON);
        }).finally(() => {
            setLoading(false);
        });
    };

    const displayRoute = (geoJSON) => {
        if (!map) return;

        if (map.getLayer(routeLayerId)) {
            map.removeLayer(routeLayerId);
        }

        if (map.getSource(routeSourceId)) {
            map.removeSource(routeSourceId);
        }

        map.addSource(routeSourceId, {
            'type': 'geojson',
            'data': geoJSON
        });

        map.addLayer({
            'id': routeLayerId,
            'type': 'line',
            'source': routeSourceId,
            'paint': {
                'line-color': 'purple',
                'line-width': 3
            }
        });
    };

    const handleDropdownChange = (event) => {
        setSelectedList(event.target.value);
        setLoading(true); // Set loading to true
    };

    const showDetails = (title, images, texts, altTableContent, prices) => {
        const modal = document.getElementById('detailsModal');
        modal.style.display = 'block';
        setDetails({
            title,
            images,
            texts,
            altTableContent,
            prices
        });
    };

    const hideDetails = () => {
        const modal = document.getElementById('detailsModal');
        modal.style.display = 'none';
    };
    return (
        <>
        <div className="container">
             
            <div className="title-container">
                <img src="img/grocery_store.jpeg" alt="Efficient Route" className="title-image" />
                <div className="title"><b>Efficient Route</b></div>
            </div>
            <div className="generate-container">
                <div className="generate-header">
                    <h2><b>Generate Route for</b></h2>
                    <h2><b>Your Shopping List</b></h2>
                </div>
                <div className="generate-content">
                    <p>Choose a shopping list to generate a route:</p>
                    <select
                        className="dropdown"
                        value={selectedList}
                        onChange={handleDropdownChange}
                    >
                        <option value="">Select a list</option>
                        {shoppingLists.map((list) => (
                            <option key={list.id} value={list.id}>{list.name}</option>
                        ))}
                    </select>

                </div>
            </div>
            <div className="mymap" id={mapId}>
                <div className="map-controls">
                    <button id="zoomInBtn"><FontAwesomeIcon icon={faPlus} /></button>
                    <button id="zoomOutBtn"><FontAwesomeIcon icon={faMinus} /></button>
                </div>
                {loading && <LoadingIndicator />} {/* Show loading indicator */}
            </div>
            
            {stores.length > 0 && (
                <div className="Store-container">
                <div className='titlu'>
                <h2> Store route order:  </h2>
            </div>
            <div className="store-container">

                {stores.map(store => (
                    <div className="store-card" key={store.name}>
                        <div className='store-card-img'> 
                            <img src={store.imgSrc} alt={`${store.name} Store`} /> 
                        </div>
                        <div className="store-card-info">
                            <h2>{store.name}</h2>
                            <div className='locatie'><img src="img/ico/icon.png" alt="Location Icon" /></div>
                            <p className='p1'>{store.address}</p>
                            <hr></hr>
                            <p className='price'>Price: <b>{store.price}</b></p>
                        </div>
                        <div className="details-button-container">
                            <button className="details-button" onClick={() => showDetails(
                                store.name,
                                store.details.images,
                                store.details.texts,
                                store.details.altTableContent,
                                store.details.prices
                            )}>
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            </div>
            )}
            <div id="detailsModal" className="route-modal">
                <div className="road-modal-content">
                    <span className="close" onClick={hideDetails}>&times;</span>
                    <div id="imageGallery" className="image-gallery">
                        {details.images.map((imageSrc, index) => (
                            <div key={index}>
                                {imageSrc ? <img src={imageSrc} alt={details.texts[index]} /> : <p>No image available</p>}
                                <p><strong><u>{details.texts[index]}</u></strong></p>
                                <p>Price: {details.altTableContent[index]}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bottom-container">
                        <button className="back-button" onClick={hideDetails}>Back to Shopping List</button>
                    </div>
                </div>
            </div>            
        </div>
       
        </>
    );
}