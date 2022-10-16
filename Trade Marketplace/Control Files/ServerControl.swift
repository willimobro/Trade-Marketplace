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
    
    func setDataCreateAJob(JobName: String, Category: String, When: String, Where: String, Tags: String) {
        // [START set_document]
        // Add a new document in collection "cities"
        
        db.collection(Category).document("Work").setData([
            "JobName": JobName,
            "Category": Category,
            "When": When,
            "Where": Where,
            "Tags": Tags
        ])
        { err in
            if let err = err {
                print("Error writing document: \(err)")
            } else {
                print("Document successfully written!")
            }
        }
    }
}
 



