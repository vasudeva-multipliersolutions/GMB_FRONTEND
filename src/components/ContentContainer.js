import React, { Fragment } from 'react'
import CardContainer from './CardContainer'

export default function ContentContainer(props) {
  return (
    <Fragment>
        <div className="content-container-2 m-3 p-3">
            {
                props.data.map(item => {
                    return Object.entries(item).map(([key, value]) => {
                        if(key != "_id")
                        {
                            return <CardContainer head = {key} val = {value}></CardContainer>
                        }
                    })
                })
            }
        </div>
    </Fragment>
  )
}
