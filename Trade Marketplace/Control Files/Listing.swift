//
//  Listing.swift
//  Trade Marketplace
//
//  Created by William larsen on 8/10/22.
//

import SwiftUI
import FirebaseFirestore
import FirebaseDatabase
import FirebaseAuth

struct listingItem: Identifiable   {
    var id = UUID()
    var category: String
    var title: String
    var subtitle: String
    var quotesent: Int
    var location: String
    var description: String
    var images: String
    var bot: Bool
}

var totaljobs = [
    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small jobNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small joNeeding a house rewire to comply with coc requirements but is a small jo", images: "weld", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "conveyor", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "mech", bot: true),
    listingItem(category: "GasFitting", title: "Needing a gas fitter", subtitle: "Installation of gas heating system", quotesent: 15, location: "Dunedin, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "building", bot: true),
    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "bump", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "roof", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "car", bot: true),
    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "weld", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "conveyor", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "mech", bot: true),
    listingItem(category: "GasFitting", title: "Needing a gas fitter", subtitle: "Installation of gas heating system", quotesent: 15, location: "Dunedin, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "building", bot: true),
    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "bump", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "roof", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "car", bot: true),

    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "weld", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "conveyor", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "mech", bot: true),
    listingItem(category: "GasFitting", title: "Needing a gas fitter", subtitle: "Installation of gas heating system", quotesent: 15, location: "Dunedin, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "building", bot: true),
    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "bump", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "roof", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "car", bot: true),

    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "weld", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "conveyor", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "mech", bot: true),
    listingItem(category: "GasFitting", title: "Needing a gas fitter", subtitle: "Installation of gas heating system", quotesent: 15, location: "Dunedin, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "building", bot: true),
    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "bump", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "roof", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "car", bot: true),

    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "weld", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "conveyor", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "mech", bot: true),
    listingItem(category: "GasFitting", title: "Needing a gas fitter", subtitle: "Installation of gas heating system", quotesent: 15, location: "Dunedin, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "building", bot: true),
    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "bump", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "roof", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "car", bot: true),

    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "weld", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "conveyor", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "mech", bot: true),
    listingItem(category: "GasFitting", title: "Needing a gas fitter", subtitle: "Installation of gas heating system", quotesent: 15, location: "Dunedin, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "building", bot: true),
    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "bump", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "roof", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "car", bot: true),

    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "weld", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "conveyor", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "mech", bot: true),
    listingItem(category: "GasFitting", title: "Needing a gas fitter", subtitle: "Installation of gas heating system", quotesent: 15, location: "Dunedin, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "building", bot: true),
    listingItem(category: "Electrical", title: "House Rewire", subtitle: "Looking for qualified electrician", quotesent: 8, location: "Queenstown", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "bump", bot: true),
    listingItem(category: "Construction", title: "New Shed Build", subtitle: "looking for a builder for advice", quotesent: 14, location: "Wanaka, Otago", description: "Needing a house rewire to comply with coc requirements but is a small job", images: "roof", bot: true),
    listingItem(category: "Plumbing", title: "leaky toilet", subtitle: "qualified plumber needed", quotesent: 3, location: "Mataura, Southland", description: "Needig my toilet fixewd bruh shit everywere like im talking the hole floor is fucking covered in brown deep shit everywere like some bitch shat all over it", images: "car", bot: true),

    

  
    
]

//class downloadMainObjectviewdata: ObservableObject {
//    let db = Firestore.firestore()
//    let user = Auth.auth().currentUser
//    func DownloadMainViewData() { // << async, no immediate return
//        //        let uid = Auth.auth().currentUser?.uid
//        let database = Firestore.firestore().collection("users").document("RLJtKAgT5EgmM9n02F6zP3PJHdg1")
//        database.getDocument { (docSnapshot, error) in
//            guard let docSnapshot = docSnapshot, docSnapshot.exists else {return}
//            let mydata = docSnapshot.data()
//            let firstname = mydata!["firstname"] as? String ?? ""
//            let lastname = mydata!["lastname"] as? String ?? ""
//            let location = mydata!["location"] as? String ?? ""
//            let username = mydata!["username"] as? String ?? ""
//            let reviews = mydata!["reviews"] as? Int ?? 0
//
//            DispatchQueue.main.async {
////                self.firstname = firstname // << store result
////                self.lastname = lastname // << store result
////                self.location = location // << store result
////                self.reviews = reviews // << store result
////                self.username = username // << store result
//            }
//        }
//    }
//}
