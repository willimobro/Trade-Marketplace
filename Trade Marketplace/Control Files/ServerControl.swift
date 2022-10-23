//
//  Server Control.swift
//  Trade Marketplace
//
//  Created by William larsen on 11/10/22.
//

import SwiftUI
import FirebaseAuth
import Firebase
import FirebaseFirestoreSwift
import Foundation
import Firebase

class ServerControl: ObservableObject  {
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    func UploadData(data: [[String : String]], collection: String, document: String) {
        let _: [[String: String]] = data.map { dictionary in
            var dict: [String: String] = [:]
            dictionary.forEach { (key, value) in dict[key] = "\(value)" }
            db.collection(collection).document(document).setData(dict)
            { err in
                if let err = err {
                    print("Error writing document: \(err)")
                } else {
                    print("Document successfully written!")
                }
            }
            return dict
        }
    }
    func UploadUserData(data: [[String : String]]) {
        let _: [[String: String]] = data.map { dictionary in
            var dict: [String: String] = [:]
            dictionary.forEach { (key, value) in dict[key] = "\(value)" }
            db.collection("users").document(user!.uid).setData(dict)
            { err in
                if let err = err {
                    print("Error writing document: \(err)")
                } else {
                    print("Document successfully written!")
                }
            }
            return dict
        }
    }
    
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
                self.db.collection("users").document(self.user!.uid).setData(["firstname" : firstnamef, "lastname" : lastnamef, "uid": self.user!.uid])  { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.db.collection("users").document(self.user!.uid).collection("Listings").document("Listing").setData(["listing 1" : [""]])
                { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.db.collection("users").document(self.user!.uid).collection("RecievedQuotes").addDocument(data: ["listing 1" : [""]])
                { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.db.collection("users").document(self.user!.uid).collection("SentQuotes").addDocument(data: ["listing 1" : [""]])
                { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.db.collection("users").document(self.user!.uid).collection("CompletedListings").addDocument(data: ["listing 1" : [""]])
                { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.db.collection("users").document(self.user!.uid).collection("Watchlist").addDocument(data: ["listing 1" : [""]])
                { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                
                
            }
        }
    }
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
    struct ImagePicker: UIViewControllerRepresentable {
        
        @Binding var image: UIImage?
        
        private let controller = UIImagePickerController()
        
        func makeCoordinator() -> Coordinator {
            return Coordinator(parent: self)
        }
        
        class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
            
            let parent: ImagePicker
            
            init(parent: ImagePicker) {
                self.parent = parent
            }
            
            func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
                parent.image = info[.originalImage] as? UIImage
                picker.dismiss(animated: true)
            }
            
            func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
                picker.dismiss(animated: true)
            }
            
        }
        
        func makeUIViewController(context: Context) -> some UIViewController {
            controller.delegate = context.coordinator
            return controller
        }
        
        func updateUIViewController(_ uiViewController: UIViewControllerType, context: Context) {
            
        }
        
    }
}
