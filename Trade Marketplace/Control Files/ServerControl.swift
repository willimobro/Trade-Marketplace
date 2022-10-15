//
//  Server Control.swift
//  Trade Marketplace
//
//  Created by William larsen on 11/10/22.
//

import SwiftUI
import FirebaseCore
import FirebaseFirestore
import FirebaseFirestoreSwift


class ServerControl: UIViewController  {
    override func viewDidLoad() {
        super.viewDidLoad()
        }
    let db = Firestore.firestore()
    
        func setData() {
        let data: [String: Any] = [:]
        db.collection("cities").document("new-city-id").setData(data)
            return
    }
    
}
 



