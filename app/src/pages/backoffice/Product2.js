import { useState } from "react";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import axios from "axios";
import config from "../../config";
import Swal from "sweetalert2";

function Product() {
    const [product, setProduct] = useState({});
    


    const handleSave = async () => {
        try {
            product.img = "";

            const res = await axios.post(config.apiPath + '/product/create', product, config.headers());
            console.log(res.data.result.id)

            if (res.data.result.id) {
                Swal.fire({
                    title: 'seve',
                    text: 'success',
                    icon: 'success',
                    timer: 2000
                })
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    

    return <BackOffice>
        <div className="h4">Product</div>
        <button className="btn btn-primary" data-toggle='modal' data-target='#modalProduct' >
            <i className="fa fa-plus"></i> Add New
        </button>



        <MyModal id='modalProduct' title='Product'>
            <div>
                <div>Fixture Id</div>
                <input className="form-control" onChange={e => setProduct({ ...product, fixtureId: e.target.value })} />
            </div>
            <div>
                <div>Fixture Name</div>
                <input className="form-control" onChange={e => setProduct({ ...product, fixtureName: e.target.value })} />
            </div>
            <div>
                <div>Operation</div>
                <input className="form-control" onChange={e => setProduct({ ...product, operation: e.target.value })} />
            </div>
            <div>
                <div>Side</div>
                <input className="form-control" onChange={e => setProduct({ ...product, side: e.target.value })} />
            </div>
            <div>
                <div>Comp</div>
                <input className="form-control" onChange={e => setProduct({ ...product, comp: e.target.value })} />
            </div>
            <div>
                <div>Document No.</div>
                <input className="form-control" onChange={e => setProduct({ ...product, document: e.target.value })} />
            </div>
            <div>
                <div>Family</div>
                <input className="form-control" onChange={e => setProduct({ ...product, family: e.target.value })} />
            </div>
            <div>
                <div>Customer Number</div>
                <input className="form-control" onChange={e => setProduct({ ...product, cusNum: e.target.value })} />
            </div>
            <div>
                <div>Hana Number</div>
                <input className="form-control" onChange={e => setProduct({ ...product, hanaNum: e.target.value })} />
            </div>
            <div>
                <div>Product Description</div>
                <input className="form-control" onChange={e => setProduct({ ...product, productDes: e.target.value })} />
            </div>
            <div>
                <div>image</div>
                <input className="form-control" type="file" />
            </div>
            <div className="mt-2">
            <button className="btn btn-primary" onClick={handleSave}>
                <i className="fa fa-check mr-2"></i>Save
            </button>
            </div>
            
        </MyModal>
    </BackOffice>
}

export default Product;