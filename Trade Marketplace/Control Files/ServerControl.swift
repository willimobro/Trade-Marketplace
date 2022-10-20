//
//  Server Control.swift
//  Trade Marketplace
//
//  Created by William larsen on 11/10/22.
//

import SwiftUI
import FirebaseAuth
import Firebase

class ServerControl: ObservableObject  {
    
    
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
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
    
    enum FBError: Error, Identifiable {
        case error(String)
        var id: UUID {
            UUID()
        }
        var errorMessage: String    {
            switch self {
            case .error(let message):
                return message
            }
        }
    }
    func register(email: String, password: String, firstnamef: String, lastnamef: String, completion: @escaping (Result<Bool, FBError>) -> Void) {
        Auth.auth().createUser(withEmail: email, password: password) { result, error in
            if let error {
                DispatchQueue.main.async {
                    completion(.failure(.error(error.localizedDescription)))
                }
            } else {
                DispatchQueue.main.async {
                    completion(.success(true))
                }
                self.db.collection("users").addDocument(data: ["firstname" : firstnamef, "lastname" : lastnamef, "uid": result!.user.uid])  { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                
                //
            }
        }
    }
    
    ///
    func login(email: String, password: String, completion: @escaping (Result<Bool, FBError>) -> Void)    {
        Auth.auth().signIn(withEmail: email, password: password) { result, error in
            if let error {
                DispatchQueue.main.async {
                    completion(.failure(.error(error.localizedDescription)))
                }
            } else {
                DispatchQueue.main.async {
                    completion(.success(true))
                }
            }
        }
        
    }
    func pulluserdata() {
        let user = Auth.auth().currentUser
        if let user = user {
            // The user's ID, unique to the Firebase project.
            // Do NOT use this value to authenticate with your backend server,
            // if you have one. Use getTokenWithCompletion:completion: instead.
            let uid = user.uid
            db.collection("users").document(uid).getDocument { (document, error) in
                if let document = document, document.exists {
                    let dataDescription = document.data().map(String.init(describing:)) ?? "nil"
                    print("Document data: \(dataDescription)")
                } else {
                    print("Document does not exist")
                }
            }
        }
    }
}

