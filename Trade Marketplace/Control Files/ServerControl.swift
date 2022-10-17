//
//  Server Control.swift
//  Trade Marketplace
//
//  Created by William larsen on 11/10/22.
//

import SwiftUI
import FirebaseAuth
import Firebase


class UserLoggedIn: ObservableObject {
    @Published var user = 0
}

class ServerControl: UIViewController  {
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    @StateObject var loggedin = UserLoggedIn()
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
        Auth.auth().createUser(withEmail: email, password: password) { (result, err) in
            if err != nil {
                print("error creating user")
                
            } else {
                self.db.collection("users").addDocument(data: ["firstname" : firstnamef, "lastname" : lastnamef, "uid": result!.user.uid])  { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.loggedin.user = 1
//
            }
        }
    }
    
    ///
    func login(email: String, password: String)    {
        Auth.auth().signIn(withEmail: email, password: password) { (result, err) in
            if err != nil {
                return
            }
            self.loggedin.user = 1
//
            
        }
    }
}



