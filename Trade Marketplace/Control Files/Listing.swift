//
//  Listing.swift
//  Trade Marketplace
//
//  Created by William larsen on 8/10/22.
//

import SwiftUI

struct listingItem: Identifiable   {
    var id: String
    var title: String
    var subtitle: String
    var quotesent: Int
    var location: String
    var description: String
    var images: String
    var bot: Bool
}

var totaljobs = [
    listingItem(id: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "money", bot: true),
    listingItem(id: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "money", bot: true),
    listingItem(id: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "money", bot: true),
    listingItem(id: "", title: <#T##String#>, subtitle: <#T##String#>, quotesent: <#T##Int#>, location: <#T##String#>, description: <#T##String#>, images: <#T##String#>, bot: <#T##Bool#>)
]

