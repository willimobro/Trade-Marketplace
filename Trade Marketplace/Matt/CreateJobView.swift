//
//  CreateJobView.swift
//  Trade Marketplace
//
//  Created by Matthew Larsen on 8/10/22.
//

import SwiftUI
import Firebase
import FirebaseDatabase
import FirebaseAuth
import FirebaseStorage
// hello
struct CreateJobView: View {
    @State var createjobshouldShowImagePicker = false
    @State var createimage: UIImage?
    @Environment(\.dismiss) var dismiss
    @State var WhendataMain: String = "ASAP"
    @State private var jobTitle = String()
    @State private var jobDesc: String = "Describe your job and anything else you think may be required."
    @State  var manualaddress: String = ""
    @State var tags: String = "Enter Tags"
    @State var category: String = ""
    var body: some View {
        VStack(alignment: .leading){
            HStack(spacing: 30){
                Image(systemName: "xmark")
                    .resizable()
                    .frame(width: 25, height: 25)
                    .scaledToFit()
                
                
                Text("Create a job")
                    .font(.title)
                    .fontWeight(.bold)
                
                
            }.frame(width: 321, height: 24, alignment: .leading)
                .padding(.horizontal, 20)
            
            
            Divider()
                .background(.black)
                .shadow(color: .black, radius: 4, x: 0, y: 0)
                .opacity(0.5)
                .frame(height: 20, alignment: .bottom)
            
            
            
            ScrollView(.vertical){
                VStack(alignment: .leading, spacing: 10){
                    
                    
                    HStack{
                        Button {
                            createjobshouldShowImagePicker.toggle()
                        } label: {
                            UploadPictureIcon(createimage: $createimage)
                        }
                            UploadCameraIcon()
                        }.padding(.vertical, 10)
                        //Job Name
                        Text("Job name")
                            .font(.title)
                            .fontWeight(.bold)
                        VStack (alignment: .leading, spacing: 10){
                            TextField(
                                "e.g Sink Install",
                                text: $jobTitle)
                            Divider()
                                .background(.black)
                                .padding(0)
                            Text("A short job name helps tradies and the like easily identify and respond to your job")
                                .font(.footnote)
                                .foregroundColor(Color.gray)
                            
                            
                            //Description
                            Text("Description")
                                .font(.title)
                                .fontWeight(.bold)
                                .padding(.top, 10)
                            
                            
                            TextEditor(text: $jobDesc)
                                .foregroundColor(Color.black)
                                .frame(height: 200)
                                .overlay(Rectangle()
                                    .stroke(Color.secondary).opacity(0.5))
                            Group{
                                // Details
                                Details(category: $category)
                                //When
                                When(WhenDataMain: $WhendataMain)
                                
                                //Where
                                Where(manualaddress: $manualaddress)
                                
                                
                                //Add tags
                                Tags(tags: $tags)
                                
                                //Publish
                                Publish()
                                //SubmitJob
                                SubmitJob(JobName: $jobTitle, Category: $category, When: $WhendataMain, Where: $manualaddress, Tags: $tags)
                            }
                        }
                        
                        
                    } .padding(.horizontal, 20)
                    
                }
            }
        .padding(.bottom, 60)
        .fullScreenCover(isPresented: $createjobshouldShowImagePicker, onDismiss: nil) {
            ImagePicker(image1: $createimage, JobName: $jobTitle)
                .ignoresSafeArea()
            
        }
        }
    }


struct UploadPictureIcon: View {
    @Binding var createimage: UIImage?
    var body: some View {
       
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: 1, dash: [3]))
            .foregroundColor(.gray)
            .frame(width: 52, height: 52)
            .padding(5)
            .overlay(
                VStack{
                    if let image = self.createimage {
                        Image(uiImage: image)
                            .resizable()
                            .scaledToFill()
                            .foregroundColor(.gray)
                            .frame(width: 22, height: 22)
                    } else {
                        Image(systemName: "camera")
                            .resizable()
                            .scaledToFit()
                            .foregroundColor(.gray)
                            .frame(width: 22, height: 22)
                    }
                }
                )
        
    }
}


struct UploadCameraIcon: View {
    var body: some View {
       
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: 1, dash: [3]))
            .foregroundColor(.gray)
            .frame(width: 72, height: 52)
            .padding(5)
            .overlay(
                Image(systemName: "video.badge.plus")
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: 22, height: 22)
                    
            )
        
    }
}

struct SelectCategory: View {
    @Binding var category: String
    let categories = [
        "Agricultural",
        "Construction",
        "Electrical",
        "Metal Fabrication",
        "Painting",
        "Plumbing",
        "Refrigeration",
        "Welding"
    ]
    var body: some View {
       
        HStack{
            Picker("Selected Category", selection: $category)    {
                ForEach(categories, id: \.self) {
                    Text($0)
                }
            }
                .font(.footnote)
                .foregroundColor(Color.gray)
        }
        
    }
}

struct When: View {
    @Binding var WhenDataMain: String
    var body: some View {
        Text("When")
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, 10)
        HStack{
            TextField("Default: ASAP", text: $WhenDataMain)
                .font(.footnote)
                .foregroundColor(Color.gray)
            Spacer()
            Text("Select")
                .font(.footnote)
                .foregroundColor(Color.gray)
            Image(systemName: "calendar.badge.plus")
                .resizable()
                .scaledToFit()
                .foregroundColor(.gray)
                .frame(width: 40, height: 30)
        }
            Divider()
                .background(.black)
                .padding(0)
        
        
        Text("When do you need the job done")
            .font(.footnote)
            .foregroundColor(Color.gray)
        }
    }

struct Details: View {
    @Binding var category: String
    var body: some View {
        Text("Details")
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, 10)
        
        List {
            SelectCategory(category: $category)
        }.frame(height: 140)
            .listStyle(.plain)
        Text("Selecting more than one category helps you recvieve more quotes")
            .font(.footnote)
            .foregroundColor(Color.gray)
        }
    }


struct Description: View {
    var body: some View {
        Text("Details")
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, 10)
        }
    }
// hello
struct Where: View {
    @Binding var manualaddress: String
    @State private var showLocation = false
    @State var showLocationModifier = "They will come to me."
    var options = ["I'll go to them.", "They will come to me."]
    
    var body: some View {
        VStack {
            Text("Where")
                .font(.title)
                .fontWeight(.bold)
                .padding(.top, 10)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            HStack{
                VStack {
                    VStack (alignment: .center, spacing: 10){
                        Picker("Please Select an option", selection: $showLocationModifier) {
                            ForEach(options, id: \.self) {
                                Text($0)
                                   
                            }  .font(.subheadline)
                            
                        }
                        .pickerStyle(.segmented)
                        
                        if showLocationModifier == "They will come to me." {
                            Toggle("Use My Address?", isOn: $showLocation)
                                .padding(.top, 15)
                            
                            
                            if showLocation {
                                VStack(spacing: 20){
                                    Text("Users Address")
                                        .foregroundColor(Color.green)
                                        .multilineTextAlignment(.leading)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    MapView()
                                }
                            } else {
                                TextField(
                                    "123 example street, Invercargill",
                                    text: $manualaddress)
                                Divider()
                                    .background(.black)
                                    .padding(0)
                            }
                        }
                    }
                }
            }
        }
    }
}


struct Tags: View {
    @Binding var tags: String
    var body: some View {
        HStack{
            Text("Tags")
                .font(.title)
                .fontWeight(.bold)
                .padding(.top, 10)
            Spacer()
            Text("optional")
                .font(.footnote)
                .foregroundColor(Color.gray)
                .padding(.top, 14)
        }
        
        TextEditor(text: $tags)
            .foregroundColor(Color.black)
            .frame(height: 100)
            .overlay(Rectangle()
            .stroke(Color.secondary).opacity(0.5))
        }
    }

struct Publish: View {
    var body: some View {
        Text("Publish")
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, 30)
        Text("By clicking the submit button below, I hereby agree to and accept the following [terms](https://example.com) , [conditions](https://example.com) and [Privacy Policy](https://example.com) of Trade Marketplace")
            .font(.footnote)
            .padding(.bottom, 10)
        }
    }






struct CreateJobView_Previews: PreviewProvider {
    @Binding fileprivate var showLocation: Bool
    static var previews: some View {
        CreateJobView()
    }
}


struct SubmitJob: View {
    @Environment(\.dismiss) var dismiss
    let activate = ServerControl()
    @Binding  var JobName: String
    @Binding  var Category: String
    @Binding  var When: String
    @Binding  var Where: String
    @Binding  var Tags: String
    @EnvironmentObject var data: UploadJob

    var body: some View {
        RoundedRectangle(cornerRadius: 25)
            .foregroundColor(Color("UploadAJobGreen"))
            .frame(width: 359, height: 56)
            .overlay(
                VStack(alignment: .center, spacing: 0){
                    HStack{
 //                       Image (systemName: "plus.app.fill")
 //                           .resizable()
//                            .frame(width: 19, height: 19, alignment: .center)
 //                           .foregroundColor(.white)
                        Button  {
                            UploadJob().UploadjobData(data:
                            [[
                                "title": JobName,
                                "category": Category,
                                "When": When,
                                "Where": Where,
                                "Tags": Tags,
                                "images" : data.imageob!
                            ]], listingname: JobName)
                        } label:    {
                            Text("Submit Job")
                                .font(.title)
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                        }

                    }}
                    .frame(width: 319, height: 30, alignment: .center))
        }
                    
    }


class UploadJob: ObservableObject   {
    @Published var imageob: URL?
    let db = Firestore.firestore()
    let user = Auth.auth().currentUser
    func UploadjobData(data: [[String : Any]], listingname: String) {
        print(self.user!.uid)
        let _: [[String: Any]] = data.map { dictionary in
            var dict: [String: String] = [:]
            dictionary.forEach { (key, value) in dict[key] = "\(value)" }
            db.collection("users").document(self.user!.uid).collection("Listings").document(listingname).setData(dict)
            { err in
                if let err = err {
                    print("Error writing document: \(err)")
                } else {
                    print("Document successfully written!")
                }
            }
            return dict
        }
        let _: [[String: String]] = data.map { dictionary in
            var dict: [String: String] = [:]
            dictionary.forEach { (key, value) in dict[key] = "\(value)" }
            db.collection("alljobs").document(listingname).setData(dict)
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
    }

struct ImagePicker: UIViewControllerRepresentable {
    @EnvironmentObject var data: UploadJob
    @Binding var image1: UIImage?
    @Binding  var JobName: String
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
            parent.image1 = info[.originalImage] as? UIImage
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
        let lol = "images/\(uid)/\(JobName)/image1"
        guard let imageData = image1?.jpegData(compressionQuality: 0.1)! else {return}
        let ref = Storage.storage().reference(withPath: lol)
        ref.putData(imageData, metadata: nil) {metadata, err in
            if err != nil {
                print("errpr")
                return
            }
            ref.downloadURL { url, err in
                if err != nil {
                    print("error occured")
                    return
                }
                
                print("Successfully stored image with URL ")
                print(url!.absoluteString)
                data.imageob = url!.absoluteURL
                guard url != nil else {return}
            }
            
        }
        
    }
}
