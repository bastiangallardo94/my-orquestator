import { SummaryItem } from "./SummaryBanner.types"
import './SummaryBanner.scss'
import React from "react"

export interface SummaryBannerProps {
    items: SummaryItem[]
}

export const SummaryBanner = ({
    items
}: SummaryBannerProps) => {
    return (
        <div className="summary-banner">
        {items.map((item, idx) => (
            <React.Fragment key={idx}>
                <div className="summary-item">
                    <p>{item.label}</p>
                    <p className="mf-font-bold">{item.content}</p>
                </div>

                {idx < items.length - 1 && (
                    <div className="divider-spacer" aria-hidden="true">
                    <span className="divider" />
                    </div>
                )}
            </React.Fragment>
        ))}
        </div>
    )
}
