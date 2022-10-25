//
//  Server Control.swift
//  Trade Marketplace
//
//  Created by William larsen on 11/10/22.
//

import SwiftUI
import FirebaseAuth
import Firebase
import FirebaseCore
import FirebaseFirestore
import Foundation
import FirebaseDatabase
import FirebaseStorage


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
        let user = Auth.auth().currentUser
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
                let user = Auth.auth().currentUser
                self.db.collection("users").document(user!.uid).collection("Profile").document(user!.uid).setData(["firstname" : firstnamef, "lastname" : lastnamef, "uid": self.user!.uid])  { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.db.collection("users").document(user!.uid).collection("Listings").addDocument(data: ["listing 1" : [""]])
                { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.db.collection("users").document(user!.uid).collection("RecievedQuotes").addDocument(data: ["listing 1" : [""]])
                { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.db.collection("users").document(user!.uid).collection("SentQuotes").addDocument(data: ["listing 1" : [""]])
                { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.db.collection("users").document(user!.uid).collection("CompletedListings").addDocument(data: ["listing 1" : [""]])
                { (error) in
                    if error != nil {
                        print("error adding document")
                    }
                }
                self.db.collection("users").document(user!.uid).collection("Watchlist").addDocument(data: ["listing 1" : [""]])
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
            self.ImageUpload()
        }
        
        func ImageUpload() {
            guard let uid = Auth.auth().currentUser?.uid else {return}
                    guard let imageData = image?.jpegData(compressionQuality: 0.5)! else {return}
            let ref = Storage.storage().reference(withPath: uid)
            ref.putData(imageData, metadata: nil) {metadata, err in
                if let err = err {
                    print("errpr")
                    return
                }
                ref.downloadURL { url, err in
                    if let err = err {
                        print("error occured")
                        return
                    }
                    
                    print("Successfully stored image with URL ")
                    print(url?.absoluteString)
                    
                    guard let url = url else {return}
                    storeUserProfile(imageProfileUrl: url)
                }
                
            }
            
        }
        private func storeUserProfile(imageProfileUrl: URL) {
            let uid = Auth.auth().currentUser!.uid
            Firestore.firestore().collection("users").document(uid).collection("Profile").document(uid).setData(["profilepicture" : imageProfileUrl.absoluteString], merge: true)
            
        }
        
    }
}
