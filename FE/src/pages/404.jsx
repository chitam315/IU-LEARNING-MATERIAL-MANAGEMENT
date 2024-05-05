import React from 'react'
import { Link } from 'react-router-dom'
import { PATH } from '../config/PATH'

export default function Page404() {
    return (
        <main className="notfound" id="main">
            <div className="container">
                <section>
                    <h2 className="main-title">404</h2>
                    <p>CAN NOT FIND THIS PAGE</p>
                    <Link to={PATH.index} className="btn main round">GO TO HOME PAGE</Link>
                </section>
            </div>
        </main>
    )
}
