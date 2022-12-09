
import React, { Component } from 'react'
import './PostItem.css';
import Sidebar from 'containers/Owner/Sidebar/Loadable';
import Cookies from 'universal-cookie';

export default class PostItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      category: "",
      startDate : "",
      endDate : "",
      price : "",
      pincode : "",
      location : "",
      mobile : "",
      email: "",
      image : "",
      images: "",
      imgurIDs : [],
    };

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handlePincodeChange = this.handlePincodeChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleMobileChange = this.handleMobileChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleImageChange0 = this.handleImageChange0.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleImgurImagesUpload = this.handleImgurImagesUpload.bind(this); 
    //this.uploadImages = this.uploadImages.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }

  handleCategoryChange = e =>
  {
    e.preventDefault();
    this.setState({category: e.target.value});
    //console.log(e.target.value)
  };

  handleStartDateChange = e => {
    e.preventDefault();
    this.setState({startDate: e.target.value});
  };
  handleEndDateChange = e =>
  {
    e.preventDefault();
    this.setState({endDate: e.target.value});
  };
  handlePriceChange = e => {
    e.preventDefault();
    this.setState({price: e.target.value});
  };
  handlePincodeChange = e =>
  {
    e.preventDefault();
    this.setState({pincode: e.target.value});
  };
  handleLocationChange = e => {
    e.preventDefault();
    this.setState({location: e.target.value});
  };
  handleMobileChange = e =>
  {
    e.preventDefault();
    this.setState({mobile: e.target.value});
  };
  handleEmailChange = e => {
    e.preventDefault();
    this.setState({email: e.target.value});
  };
  handleImageChange0 = e => {
    e.preventDefault();
    this.setState({image: e.target.files});
    console.log("image", this.state.image)
  }
  handleImageChange = e => {
    e.preventDefault();
    this.setState({images: e.target.files});
    if(this.state.images.length>5){
      alert('you can upload maximum of 5 images')
    }
    else
    {
      console.log('images', e.target.result);
      for (var i = 0; i < this.state.images.length; i++){
          console.log(i)
      }
    }
  }


  handleImgurImagesUpload () {
    return new Promise(function (resolve, reject) {
    var file = image
    if (!file || !file.type.match(/image.*/)) reject('only images are allowed');
    const r = new XMLHttpRequest()
    const d = new FormData()
    var u = "";
    d.append('image', file)
    r.open('POST', 'https://api.imgur.com/3/image/')
    r.setRequestHeader('Authorization', `Client-ID 4f6587af59ba623`)
    r.onreadystatechange = function () {
      if(r.status === 200 && r.readyState === 4) {
        let res = JSON.parse(r.responseText)
        u = `https://i.imgur.com/${res.data.id}.png`
        console.log(u)
        resolve(res.data.id)
        // add to array
        // add await
        // after all images are uploaded, send the rest of the data
        let { imageIDs1} = this.state;
        imageIDs1.push(res.data.id);
        this.setState({imageIDs: imageIDs1});
      }
      else{
        reject('Error uploading images')
      }
    }
  });

  }

  async handlePost (e) {
    e.preventDefault();
    //defaultimage
    var file = this.state.images[0]
    if (!file || !file.type.match(/image.*/)) return;
    const r = new XMLHttpRequest()
    const d = new FormData()
    var u = "";
    d.append('image', file)
    r.open('POST', 'https://api.imgur.com/3/image/')
    r.setRequestHeader('Authorization', `Client-ID 4f6587af59ba623`)
    r.onreadystatechange = function () {
      if(r.status === 200 && r.readyState === 4) {
        let res = JSON.parse(r.responseText)
        u = `https://i.imgur.com/${res.data.id}.png`
        console.log(u)
        // add to array
        // add await
        // after all images are uploaded, send the rest of the data
        let { imageIDs1} = this.state;
        imageIDs1.push(res.data.id);
        this.setState({imageIDs: imageIDs1});
      }
    }
    r.send(d)
    //multiple images
    for (var i = 0; i < this.state.images.length; i++){
      var file = this.state.images[0]
      if (!file || !file.type.match(/image.*/)) return;
      const r = new XMLHttpRequest()
      const d = new FormData()
      var u = "";
      d.append('image', file)
      r.open('POST', 'https://api.imgur.com/3/image/')
      r.setRequestHeader('Authorization', `Client-ID 4f6587af59ba623`)
      r.onreadystatechange = function () {
        if(r.status === 200 && r.readyState === 4) {
          let res = JSON.parse(r.responseText)
          u = `https://i.imgur.com/${res.data.id}.png`
          console.log(u)
          // add to array
          // add await
          // after all images are uploaded, send the rest of the data
          let { imageIDs1} = this.state;
          imageIDs1.push(res.data.id);
          this.setState({imageIDs: imageIDs1});
        }
      }
      r.send(d)
    }

    //sending state and array
    const response = await fetch(process.env.HOST_URL + '/api/renter/item',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          startDate : this.state.startDate,
          endDate : this.state.endDate,
          price : this.state.price,
          pincode : this.state.pincode,
          location : this.state.location,
          mobile : this.state.mobile,
          email: this.state.email,
          imgurIDs : this.state.imgurIDs,
        }),
      },
    );
  };

  render(){
    return (
      <div className='sidebaralign'>
        <div>
          <Sidebar/>
        </div>
      <form method = 'POST' style = {{margintop : 1400}}>
        <div className="App-wrapper-here">
          <div className="auth-inner">
            <div className = "App">
                <h2>Rent an Item</h2>

                <div className="mb-3">
                <label>Product Type</label>
                <select 
                        name = "dropdown"
                        className="form-control"
                        value={this.state.category} 
                        onChange={this.handleCategoryChange} 
                    >
                    <option value="Boat">Boat</option>
                        <option value="Car">Car</option>
                        <option value="House">House</option>
                        <option value="Service">Skilled Worker</option>
                    </select>
                </div>

                <div className="mb-3">
                <label>Price</label>
                <input
                    type="number"
                    name = "price"
                    className="form-control"
                    placeholder="Enter price"
                    value={this.state.price} 
                    onChange={this.handlePriceChange}
                />
                </div>


                <div className="mb-3">
                <label>Pincode</label>
                <input
                    type="number"
                    name = "pincode"
                    inputmode="numeric"
                    pattern="[0-9]{4}"
                    className="form-control"
                    placeholder="Enter pincode"
                    value={this.state.pincode} 
                    onChange={this.handlePincodeChange}
                />
                </div>

                <div className="mb-3">
                <label>Address</label>
                <input
                    type="text"
                    name = "address"
                    className="form-control"
                    placeholder="Enter address"
                    value={this.state.location} 
                    onChange={this.handleLocationChange}
                />
                </div>

                <div className="mb-3">
                <label>Mobile</label>
                <input
                    type="number"
                    pattern = "[0-9]{10}"
                    name = "mobile"
                    className="form-control"
                    placeholder="Enter mobile number"
                    value={this.state.mobile} 
                    onChange={this.handleMobileChange}
                />
                </div>

                <div className="mb-3">
                  <label>Image</label>
                  <div>
                      <input type="file" accept="image/*"
                              name="images"
                              className="form-control"
                             onChange={this.handleImageChange0} />
                      
                  </div>
                </div>

                <div className="mb-3">

                  <label>Image</label>
                  <div>
                      <input type="file" multiple accept="image/*"
                              name="images"
                              className="form-control"
                             onChange={this.handleImageChange} />
                  </div>
                </div>

                <div className="d-grid">
                <button type="submit" className="btn btn-primary" onClick={this.handlePost}>
                    Submit
                </button>
                </div>
                </div>
            </div>
            </div>
      </form>
      </div>
    )
  }
}