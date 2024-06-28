import { useEffect, useState, useRef } from "react";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import axios from "axios";
import config from "../../config";
import Swal from "sweetalert2";

function Product() {
    const [product, setProduct] = useState({}); //create, update
    const [products, setProducts] = useState([]); //show
    const [img, setImg] = useState({}); //File for Upload
    const [fileExcel, setFileExcel] = useState({}); //File for Excel
    const refImg = useRef();
    const refExcel = useRef();

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('img', img);

            const res = await axios.post(config.apiPath + '/product/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            })

            if (res.data.newName !== undefined) {
                return res.data.newName;
            }
        } catch (e) {          
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })

            return "";
        }
    }


    const handleSave = async () => {
        try {
            product.img = await handleUpload();

            let res;

            if (product.id === undefined) {
                res = await axios.post(config.apiPath + '/product/create', product, config.headers());
            } else {
                res = await axios.put(config.apiPath + '/product/update', product, config.headers());
            }

            

            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'save',
                    text: 'success',
                    icon: 'success',
                    timer: 1000
                })
                document.getElementById('modalProduct_btnClose').click();
                fetchData();

                setProduct({ ...product, id: undefined }); // Clear id
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers());
            if (res.data.results !== undefined) {
                setProducts(res.data.results);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }


    const clearForm = () => {
        setProduct({
            fixtureId: '',
            fixtureName: '',
            operation: '',
            side: '',
            comp: '',
            document: '',
            family: '',
            cusNum: '',
            hanaNum: '',
            productDes: ''
        })
        setImg(null);
        refImg.current.value = '';
    }

    const handleRemove = async (item) => {
        try {
            const button = await Swal.fire({
                text: 'remove item',
                title: 'remove',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })

            if (button.isConfirmed) {
                const res = await axios.delete(config.apiPath + '/product/remove/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'remove',
                        text: 'remove success',
                        icon: 'success',
                        timer: 1000
                    })

                    fetchData();
                }
            } 
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const selectedFile = (inputFile) => {
        if (inputFile !== undefined) {
            if (inputFile.length > 0) {
                setImg(inputFile[0]);
            }
        }
    }

    const selectedFileExcel = (fileInput) => {
        if (fileInput !== undefined) {
            if (fileInput.length > 0) {
                setFileExcel(fileInput[0]);
            }
        }
    }

    const handleUploadExcel = async () => {
        try {
            const formData = new FormData();
            formData.append('fileExcel', fileExcel);

            const res = await axios.post(config.apiPath + '/product/uploadFromExcel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (res.data.message === 'success') {
                Swal.fire ({
                    title: 'upload file',
                    text: 'upload success',
                    icon: 'success',
                    timer: 1000
                });

                fetchData();

                document.getElementById('modalExcel_btnClose').click();
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const clearFormExcel = () => {
        refExcel.current.value ='';
        setFileExcel(null);
    }

    function showImage(item) {
        if (item.img !== "") {
            return <img alt='' className="img-fluid" src={config.apiPath + '/uploads/' + item.img} />;
        }

        return<></>
    }

    return <BackOffice>
        <div className="h4">Product</div>
        <button onClick={clearForm} className="btn btn-primary mr-2" data-toggle='modal' data-target='#modalProduct' >
            <i className="fa fa-plus mr-2"></i> Add New
        </button>
        <button onClick={clearFormExcel} className="btn btn-success" data-toggle='modal' data-target='#modalExcel'>
            <i className="fa fa-arrow-down mr-2"></i>Import form Excel
        </button>

        <table className="mt-3 table table-bordered table-striped">
            <thead>
                <tr>
                    <th width='150px'>Image Product</th>
                    <th>fixtureId</th>
                    <th width='150px' className="text-right">fixtureName</th>
                    <th width='150px' className="text-right">operation</th>
                    <th width='150px' className="text-right">document</th>
                    <th width='150px' className="text-right">family</th>
                    <th width='150px' className="text-right">productDes</th>
                    <th width='140px'></th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map(item =>
                    <tr key={item.id}>
                        <td>{showImage(item)}</td>
                        <td>{item.fixtureId}</td>
                        <td className="text-right">{item.fixtureName}</td>
                        <td className="text-right">{item.operation}</td>
                        <td className="text-right">{item.document}</td>
                        <td className="text-right">{item.family}</td>
                        <td className="text-right">{item.productDes}</td>
                        <td className="text-center">
                            <button className="btn btn-primary mr-2"
                                data-toggle = 'modal'
                                data-target = '#modalProduct'
                                onClick={e => setProduct(item)}>
                                <i className="fa fa-edit"></i>
                            </button>
                            <button className="btn btn-danger" onClick={e => handleRemove(item)}>
                                <i className="fa fa-times"></i>
                            </button>
                        </td>
                    </tr>
                ) : <></>}
            </tbody>
        </table>


        <MyModal id='modalProduct' title='Product'>
            <div>
                <div>Fixture Id</div>
                <input value={product.fixtureId} className="form-control" onChange={e => setProduct({ ...product, fixtureId: e.target.value })} />
            </div>
            <div>
                <div>Fixture Name</div>
                <input value={product.fixtureName} className="form-control" onChange={e => setProduct({ ...product, fixtureName: e.target.value })} />
            </div>
            <div>
                <div>Operation</div>
                <input value={product.operation} className="form-control" onChange={e => setProduct({ ...product, operation: e.target.value })} />
            </div>
            <div>
                <div>Side</div>
                <input value={product.side} className="form-control" onChange={e => setProduct({ ...product, side: e.target.value })} />
            </div>
            <div>
                <div>Comp</div>
                <input value={product.comp} className="form-control" onChange={e => setProduct({ ...product, comp: e.target.value })} />
            </div>
            <div>
                <div>Document No.</div>
                <input value={product.document} className="form-control" onChange={e => setProduct({ ...product, document: e.target.value })} />
            </div>
            <div>
                <div>Family</div>
                <input value={product.family} className="form-control" onChange={e => setProduct({ ...product, family: e.target.value })} />
            </div>
            <div>
                <div>Customer Number</div>
                <input value={product.cusNum} className="form-control" onChange={e => setProduct({ ...product, cusNum: e.target.value })} />
            </div>
            <div>
                <div>Hana Number</div>
                <input value={product.hanaNum} className="form-control" onChange={e => setProduct({ ...product, hanaNum: e.target.value })} />
            </div>
            <div>
                <div>Product Description</div>
                <input value={product.productDes} className="form-control" onChange={e => setProduct({ ...product, productDes: e.target.value })} />
            </div>
            <div>
                <div className="mb-2">{showImage(product)}</div>
                <div>Image</div>
                <input className="form-control" type="file" ref={refImg} onChange={e => selectedFile(e.target.files)} />
            </div>
            <div className="mt-2">
            <button className="btn btn-primary" onClick={handleSave}>
                <i className="fa fa-check mr-2"></i>Save
            </button>
            </div>
            
        </MyModal>
        <MyModal id='modalExcel' title='Import file'>
            <div>Selected file</div>
            <input className="form-control" type="file" ref={refExcel} onChange={e => selectedFileExcel(e.target.files)} />

            <button className="mt-3 btn btn-primary" onClick={handleUploadExcel}>
                <i className="fa fa-check mr2"></i>Save
            </button>
        </MyModal>
    </BackOffice>
}

export default Product;