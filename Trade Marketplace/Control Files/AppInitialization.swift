//
//  AppInitialization.swift
//  Trade Marketplace
//
//  Created by William larsen on 23/10/22.
//

import SwiftUI
import Firebase
import FirebaseDatabase

class downloadprofileviewdata: ObservableObject {
    @Published  var firstname: String = ""
    @Published  var lastname: String = ""
    @Published  var location: String = ""
    @Published  var username: String = ""
    @Published  var reviews: Int = 0
    init() {
        DownloadProfileViewData()
    }
    
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    func DownloadProfileViewData() { // << async, no immediate return
        //        let uid = Auth.auth().currentUser?.uid
        let database = Firestore.firestore().collection("users").document("RLJtKAgT5EgmM9n02F6zP3PJHdg1")
        database.getDocument { (docSnapshot, error) in
            guard let docSnapshot = docSnapshot, docSnapshot.exists else {return}
            let mydata = docSnapshot.data()
            let firstname = mydata!["firstname"] as? String ?? ""
            let lastname = mydata!["lastname"] as? String ?? ""
            let location = mydata!["location"] as? String ?? ""
            let username = mydata!["username"] as? String ?? ""
            let reviews = mydata!["reviews"] as? Int ?? 0
            
            DispatchQueue.main.async {
                self.firstname = firstname // << store result
                self.lastname = lastname // << store result
                self.location = location // << store result
                self.reviews = reviews // << store result
                self.username = username // << store result
            }
        }
    }
    
    
}

/// Download all completed listing data
class downloadcompletedlistingsdata: ObservableObject{
    @Published var output: [downloadcompleteddatastruct] = []
    @Published var count: NSNumber = 0
    
    init() {
        getData()
    }
    
    let user = Auth.auth().currentUser
    let db = Firestore.firestore()
    let ref = Firestore.firestore().collection("users").document("RLJtKAgT5EgmM9n02F6zP3PJHdg1").collection("CompletedListings")
    
     func getData() {
        output.removeAll()
         

              ref.getDocuments { (snapshot, error) in
            guard error == nil else {
                print(error!.localizedDescription)
                return
            }
            
                  print("Number of documents: \(snapshot.documents.count ?? -1)")
                      snapshot.documents.forEach({ (documentSnapshot) in
                        let documentData = documentSnapshot.data()
                    let data = documentSnapshot.data()
                    
                    let id = data["id"] as? String ?? ""
                    let category = data["category"] as? String ?? ""
                    let title = data["title"] as? String ?? ""
                    let subtitle = data["subtitle"] as? String ?? ""
                    let quotesent = data["quotesent"] as? Int ?? 0
                    let location = data["location"] as? String ?? ""
                    let description = data["description"] as? String ?? ""
                    let images = data["images"] as? String ?? ""
                    let bot = data["bot"] as? Bool ?? false
                    
                    let a = downloadcompleteddatastruct(id: id, category: category, title: title, subtitle: subtitle, quotesent: quotesent, location: location, description: description, images: images, bot: bot)
                    self.output.append(a)
                    
                })
            }
            
        }
        
    }

//    private func collectquerycount() {
//        let collection = self.ref
//        let countQuery = collection.count
//        do {
//            let snapshot = countQuery.getAggregation(source: .server)
//            print(snapshot.count)
//            let count = snapshot.count
//            self.count = count
//        } catch {
//            print(error);
//        }
//    }
//}
   
/// Store all completed listing data
struct downloadcompleteddatastruct: Identifiable  {
    var id: String
        var category: String
        var title: String
        var subtitle: String
        var quotesent: Int
        var location: String
        var description: String
        var images: String
        var bot: Bool
}


class downloadlistingsdata: ObservableObject{}
class downloadrecievedQuotes: ObservableObject{}
class downloadSentQuotes: ObservableObject{}
class downloadWatchlist: ObservableObject{}


