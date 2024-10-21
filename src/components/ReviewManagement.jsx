import React, { useContext, useEffect, useState } from "react";
import { SharedContext } from "../context/SharedContext";
import Noreview from "./Noreview";

export default function ReviewManagement() {
  const { getDrName } = useContext(SharedContext);
  const api = localStorage.getItem("API");
  const [docData, setDocData] = useState();
  let result = {}
  const [getReview, setReview] = useState();
  const [getReply, setReply] = useState({Five: '', Four: '', Three: '', Two: '', One: ''});
  function getAllReplies(e)
  {
    const {name, value} = e.target;
    setReply({...getReply, [name]: value})
  }
  function ReplyReviews(e)
  {
    e.preventDefault()
    if(docData.fullReview?.FIVE?.length != 0)
    {
      result['FIVE'] = {}
      result['FIVE']['accounts'] = []
      result['FIVE']['Reply'] = getReply.Five
      for (let i = 0; i < docData.fullReview.FIVE.length; i++)
      {
        //console.log(docData.fullReview.FIVE[i].loc)
        result['FIVE']['accounts'].push(docData.fullReview.FIVE[i].loc)
      }
    }
    if(docData.fullReview?.FOUR?.length != 0)
    {
      result['FOUR'] = {}
      result['FOUR']['accounts'] = []
      result['FOUR']['Reply'] = getReply.Four
      for (let i = 0; i < docData.fullReview.FOUR.length; i++)
      {
        //console.log(docData.fullReview.FOUR[i].loc)
        result['FOUR']['accounts'].push(docData.fullReview.FOUR[i].loc)
      }
    }
    if(docData.fullReview?.THREE?.length != 0)
    {
      result['THREE'] = {}
      result['THREE']['accounts'] = []
      result['THREE']['Reply'] = getReply.Three
      for (let i = 0; i < docData.fullReview.THREE.length; i++)
      {
       //console.log(docData.fullReview.THREE[i].loc)
        result['THREE']['accounts'].push(docData.fullReview.THREE[i].loc)
      }
    }
    if(docData.fullReview?.TWO?.length != 0)
    {
      result['TWO'] = {}
      result['TWO']['accounts'] = []
      result['TWO']['Reply'] = getReply.Two
      for (let i = 0; i < docData.fullReview.TWO.length; i++)
      {
        //console.log(docData.fullReview.TWO[i].loc)
        result['TWO']['accounts'].push(docData.fullReview.TWO[i].loc)
      }
    }
    if(docData.fullReview?.ONE?.length != 0)
    {
      result['ONE'] = {}
      result['ONE']['accounts'] = []
      result['ONE']['Reply'] = getReply.One
      for (let i = 0; i < docData.fullReview.ONE.length; i++)
      {
        //console.log(docData.fullReview.ONE[i].loc)
        result['ONE']['accounts'].push(docData.fullReview.ONE[i].loc)
      }
    }
   // console.log("result: ",result)
  }
  useEffect(() => {
    if (getDrName) {
      async function getDocData() {
        setReview(true);
        const response = await fetch(api + "/docData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ businessName: getDrName }),
        });
        const data = await response.json();
        //console.log(data);
        if (
          data.fullReview?.FIVE?.length == 0 &&
          data.fullReview?.FOUR?.length == 0 &&
          data.fullReview?.THREE?.length == 0 &&
          data.fullReview?.TWO?.length == 0 &&
          data.fullReview?.ONE?.length == 0
        ) {
        return  setReview(false);
        }
        
        setDocData(data);
      }
      getDocData();
    }
  }, [getDrName]);

  const averageRating = docData && parseFloat(docData.averageRating);

  
  return !getReview ? (
    <div>
    
      <Noreview></Noreview>
    </div>
  ) : (
    docData && (
      <div className="card m-5 p-3">
          <div className="row">
            <div className="col-6">
              <label className="mb-2 mt-3">
                1 Star ({docData.fullReview?.ONE?.length})
              </label>
              <textarea
                name="Five"
                id=""
                className="form-control"
                disabled={docData.fullReview?.ONE?.length === 0}
                placeholder={
                  docData.fullReview?.ONE?.length === 0
                    ? "No Reviews Available"
                    : "Enter Reply"
                }
                onChange={getAllReplies}
                value={getReply.Five}
              ></textarea>
            </div>
            <div className="col-6">
              <label className="mb-2 mt-3">
                2 Star ({docData.fullReview?.TWO?.length})
              </label>
              <textarea
                name="Four"
                id=""
                className="form-control"
                disabled={docData.fullReview?.TWO?.length === 0}
                placeholder={
                  docData.fullReview?.TWO?.length === 0
                    ? "No Reviews Available"
                    : "Enter Reply"
                }
                onChange={getAllReplies}
                value={getReply.Four}
              ></textarea>
            </div>
            <div className="col-6">
              <label className="mb-2 mt-3">
                3 Star ({docData.fullReview?.THREE?.length})
              </label>
              <textarea
                name="Three"
                id=""
                className="form-control"
                disabled={docData.fullReview?.THREE?.length === 0}
                placeholder={
                  docData.fullReview?.THREE?.length === 0
                    ? "No Reviews Available"
                    : "Enter Reply"
                }
                onChange={getAllReplies}
                value={getReply.Three}
              ></textarea>
            </div>
            <div className="col-6">
              <label className="mb-2 mt-3">
                4 Star ({docData.fullReview?.FOUR?.length})
              </label>
              <textarea
                name="Two"
                id=""
                className="form-control"
                disabled={docData.fullReview?.FOUR?.length === 0}
                placeholder={
                  docData.fullReview?.FOUR?.length === 0
                    ? "No Reviews Available"
                    : "Enter Reply"
                }
                onChange={getAllReplies}
                value={getReply.Two}
              ></textarea>
            </div>
            <div className="col-6">
              <label className="mb-2 mt-3">
                5 Star ({docData.fullReview?.FIVE?.length})
              </label>
              <textarea
                name="One"
                id=""
                className="form-control"
                disabled={docData.fullReview?.FIVE?.length === 0}
                placeholder={
                  docData.fullReview?.FIVE?.length === 0
                    ? "No Reviews Available"
                    : "Enter Reply"
                }
                onChange={getAllReplies}
                value={getReply.One}
              ></textarea>
            </div>
          </div>
        <center>
          <button className="btn btn-info mt-4" onClick={ReplyReviews}>Submit</button>
        </center>
      </div>
    )
  );
}