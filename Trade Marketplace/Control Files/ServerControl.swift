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
import FirebaseAuth


class ServerControl: UIViewController  {
    override func viewDidLoad() {
        super.viewDidLoad()
        }
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    let activate = LandingControl()
    ///
    func setDataCreateAJob(JobName: String, Category: String, When: String, Where: String, Tags: String) {
        // [START set_document]
        // Add a new document in collection "cities"
        
        db.collection("Users").document(user!.uid).collection("Live Jobs").document(JobName).setData([
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
    ///
    ///
    func register(email: String, password: String, firstnamef: String, lastnamef: String) {
        Auth.auth().createUser(withEmail: email, password: password) { result, error in
            if error != nil {
                return
                
            } else {
                self.db.collection("Users").addDocument(data: ["firstname": firstnamef, "lastname": lastnamef, "uid": result!.user.uid]) { (error) in
                    if error != nil {
                        return
                    }
                    else    {
                        self.activate.selectedbutton = .home
                    }
                }
            }
        }
    }
    ///
    func login(email: String, password: String)    {
        Auth.auth().signIn(withEmail: email, password: password) { result, error in
            if error != nil {
                return
            } else {
                self.activate.selectedbutton = .home
            }
        }
    }
}
 



