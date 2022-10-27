@_private(sourceFile: "CreateJobView.swift") import Trade_Marketplace
import FirebaseDatabase
import FirebaseStorage
import FirebaseAuth
import Firebase
import SwiftUI
import SwiftUI

extension ImagePicker {
    @_dynamicReplacement(for: ImageUpload()) private func __preview__ImageUpload() {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 486)
        guard let uid = Auth.auth().currentUser?.uid else {return}
        let lol = "images/\(uid)/\(JobName)/image1"
        guard let imageData = image1?.jpegData(compressionQuality: 0.1)! else {return}
        let ref = Storage.storage().reference(withPath: lol)
        ref.putData(imageData, metadata: nil) {metadata, err in
            if err != nil {
                print(__designTimeString("#6541.[18].[8].[4].modifier[0].arg[2].value.[0].[0].[0].arg[0].value", fallback: "errpr"))
                return
            }
            ref.downloadURL { url, err in
                if err != nil {
                    print(__designTimeString("#6541.[18].[8].[4].modifier[0].arg[2].value.[1].modifier[0].arg[0].value.[0].[0].[0].arg[0].value", fallback: "error occured"))
                    return
                }
                
                print(__designTimeString("#6541.[18].[8].[4].modifier[0].arg[2].value.[1].modifier[0].arg[0].value.[1].arg[0].value", fallback: "Successfully stored image with URL "))
                print(url!.absoluteString)
                data.imageob = url!.absoluteURL
                guard url != nil else {return}
            }
            
        }
        
    
#sourceLocation()
    }
}

extension ImagePicker {
    @_dynamicReplacement(for: updateUIViewController(_:context:)) private func __preview__updateUIViewController(_ uiViewController: UIViewControllerType, context: Context) {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 482)
        self.ImageUpload()
    
#sourceLocation()
    }
}

extension ImagePicker.Coordinator {
typealias Coordinator = ImagePicker.Coordinator

    @_dynamicReplacement(for: imagePickerControllerDidCancel(_:)) private func __preview__imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 471)
            picker.dismiss(animated: __designTimeBoolean("#6541.[18].[5].[3].[0].modifier[0].arg[0].value", fallback: true))
        
#sourceLocation()
    }
}

extension ImagePicker.Coordinator {
    @_dynamicReplacement(for: imagePickerController(_:didFinishPickingMediaWithInfo:)) private func __preview__imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 466)
            parent.image1 = info[.originalImage] as? UIImage
            picker.dismiss(animated: __designTimeBoolean("#6541.[18].[5].[2].[1].modifier[0].arg[0].value", fallback: true))
        
#sourceLocation()
    }
}

extension ImagePicker {
    @_dynamicReplacement(for: makeCoordinator()) private func __preview__makeCoordinator() -> Coordinator {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 454)
        return Coordinator(parent: self)
    
#sourceLocation()
    }
}

extension UploadJob {
    @_dynamicReplacement(for: UploadjobData(data:listingname:)) private func __preview__UploadjobData(data: [[String : Any]], listingname: String) {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 417)
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
    
#sourceLocation()
    }
}

extension SubmitJob {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 378)
        RoundedRectangle(cornerRadius: __designTimeInteger("#6541.[16].[8].property.[0].[0].arg[0].value", fallback: 25))
            .foregroundColor(Color(__designTimeString("#6541.[16].[8].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: "UploadAJobGreen")))
            .frame(width: __designTimeInteger("#6541.[16].[8].property.[0].[0].modifier[1].arg[0].value", fallback: 359), height: __designTimeInteger("#6541.[16].[8].property.[0].[0].modifier[1].arg[1].value", fallback: 56))
            .overlay(
                VStack(alignment: .center, spacing: __designTimeInteger("#6541.[16].[8].property.[0].[0].modifier[2].arg[0].value.arg[1].value", fallback: 0)){
                    HStack{
 //                       Image (systemName: "plus.app.fill")
 //                           .resizable()
//                            .frame(width: 19, height: 19, alignment: .center)
 //                           .foregroundColor(.white)
                        Button  {
                            UploadJob().UploadjobData(data:
                            [[
                                __designTimeString("#6541.[16].[8].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value.[0].arg[0].value.[0].[0].key", fallback: "title"): JobName,
                                __designTimeString("#6541.[16].[8].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value.[0].arg[0].value.[0].[1].key", fallback: "category"): Category,
                                __designTimeString("#6541.[16].[8].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value.[0].arg[0].value.[0].[2].key", fallback: "When"): When,
                                __designTimeString("#6541.[16].[8].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value.[0].arg[0].value.[0].[3].key", fallback: "Where"): Where,
                                __designTimeString("#6541.[16].[8].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value.[0].arg[0].value.[0].[4].key", fallback: "Tags"): Tags,
                                __designTimeString("#6541.[16].[8].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[0].value.[0].arg[0].value.[0].[5].key", fallback: "images") : data.imageob!
                            ]], listingname: JobName)
                        } label:    {
                            Text(__designTimeString("#6541.[16].[8].property.[0].[0].modifier[2].arg[0].value.arg[2].value.[0].arg[0].value.[0].arg[1].value.[0].arg[0].value", fallback: "Submit Job"))
                                .font(.title)
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                        }

                    }}
                    .frame(width: __designTimeInteger("#6541.[16].[8].property.[0].[0].modifier[2].arg[0].value.modifier[0].arg[0].value", fallback: 319), height: __designTimeInteger("#6541.[16].[8].property.[0].[0].modifier[2].arg[0].value.modifier[0].arg[1].value", fallback: 30), alignment: .center))
        
#sourceLocation()
    }
}

extension CreateJobView_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 362)
        CreateJobView()
    
#sourceLocation()
    }
}

extension Publish {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 344)
        Text(__designTimeString("#6541.[14].[0].property.[0].[0].arg[0].value", fallback: "Publish"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#6541.[14].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 30))
        Text(__designTimeString("#6541.[14].[0].property.[0].[1].arg[0].value", fallback: "By clicking the submit button below, I hereby agree to and accept the following [terms](https://example.com) , [conditions](https://example.com) and [Privacy Policy](https://example.com) of Trade Marketplace"))
            .font(.footnote)
            .padding(.bottom, __designTimeInteger("#6541.[14].[0].property.[0].[1].modifier[1].arg[1].value", fallback: 10))
        
#sourceLocation()
    }
}

extension Tags {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 322)
        HStack{
            Text(__designTimeString("#6541.[13].[1].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: "Tags"))
                .font(.title)
                .fontWeight(.bold)
                .padding(.top, __designTimeInteger("#6541.[13].[1].property.[0].[0].arg[0].value.[0].modifier[2].arg[1].value", fallback: 10))
            Spacer()
            Text(__designTimeString("#6541.[13].[1].property.[0].[0].arg[0].value.[2].arg[0].value", fallback: "optional"))
                .font(.footnote)
                .foregroundColor(Color.gray)
                .padding(.top, __designTimeInteger("#6541.[13].[1].property.[0].[0].arg[0].value.[2].modifier[2].arg[1].value", fallback: 14))
        }
        
        TextEditor(text: $tags)
            .foregroundColor(Color.black)
            .frame(height: __designTimeInteger("#6541.[13].[1].property.[0].[1].modifier[1].arg[0].value", fallback: 100))
            .overlay(Rectangle()
            .stroke(Color.secondary).opacity(__designTimeFloat("#6541.[13].[1].property.[0].[1].modifier[2].arg[0].value.modifier[1].arg[0].value", fallback: 0.5)))
        
#sourceLocation()
    }
}

extension Where {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 270)
        VStack {
            Text(__designTimeString("#6541.[12].[4].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: "Where"))
                .font(.title)
                .fontWeight(.bold)
                .padding(.top, __designTimeInteger("#6541.[12].[4].property.[0].[0].arg[0].value.[0].modifier[2].arg[1].value", fallback: 10))
                .frame(maxWidth: .infinity, alignment: .leading)
            
            HStack{
                VStack {
                    VStack (alignment: .center, spacing: __designTimeInteger("#6541.[12].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[1].value", fallback: 10)){
                        Picker(__designTimeString("#6541.[12].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[0].arg[0].value", fallback: "Please Select an option"), selection: $showLocationModifier) {
                            ForEach(options, id: \.self) {
                                Text($0)
                                   
                            }  .font(.subheadline)
                            
                        }
                        .pickerStyle(.segmented)
                        
                        if showLocationModifier == "They will come to me." {
                            Toggle(__designTimeString("#6541.[12].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[0].arg[0].value", fallback: "Use My Address?"), isOn: $showLocation)
                                .padding(.top, __designTimeInteger("#6541.[12].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[0].modifier[0].arg[1].value", fallback: 15))
                            
                            
                            if showLocation {
                                VStack(spacing: __designTimeInteger("#6541.[12].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[0].[0].arg[0].value", fallback: 20)){
                                    Text(__designTimeString("#6541.[12].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[0].[0].arg[1].value.[0].arg[0].value", fallback: "Users Address"))
                                        .foregroundColor(Color.green)
                                        .multilineTextAlignment(.leading)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    MapView()
                                }
                            } else {
                                TextField(
                                    __designTimeString("#6541.[12].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[1].[0].arg[0].value", fallback: "123 example street, Invercargill"),
                                    text: $manualaddress)
                                Divider()
                                    .background(.black)
                                    .padding(__designTimeInteger("#6541.[12].[4].property.[0].[0].arg[0].value.[1].arg[0].value.[0].arg[0].value.[0].arg[2].value.[1].[0].[1].[1].[1].modifier[1].arg[0].value", fallback: 0))
                            }
                        }
                    }
                }
            }
        }
    
#sourceLocation()
    }
}

extension Description {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 256)
        Text(__designTimeString("#6541.[11].[0].property.[0].[0].arg[0].value", fallback: "Details"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#6541.[11].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        
#sourceLocation()
    }
}

extension Details {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 238)
        Text(__designTimeString("#6541.[10].[1].property.[0].[0].arg[0].value", fallback: "Details"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#6541.[10].[1].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        
        List {
            SelectCategory(category: $category)
        }.frame(height: __designTimeInteger("#6541.[10].[1].property.[0].[1].modifier[0].arg[0].value", fallback: 140))
            .listStyle(.plain)
        Text(__designTimeString("#6541.[10].[1].property.[0].[2].arg[0].value", fallback: "Selecting more than one category helps you recvieve more quotes"))
            .font(.footnote)
            .foregroundColor(Color.gray)
        
#sourceLocation()
    }
}

extension When {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 206)
        Text(__designTimeString("#6541.[9].[1].property.[0].[0].arg[0].value", fallback: "When"))
            .font(.title)
            .fontWeight(.bold)
            .padding(.top, __designTimeInteger("#6541.[9].[1].property.[0].[0].modifier[2].arg[1].value", fallback: 10))
        HStack{
            TextField(__designTimeString("#6541.[9].[1].property.[0].[1].arg[0].value.[0].arg[0].value", fallback: "Default: ASAP"), text: $WhenDataMain)
                .font(.footnote)
                .foregroundColor(Color.gray)
            Spacer()
            Text(__designTimeString("#6541.[9].[1].property.[0].[1].arg[0].value.[2].arg[0].value", fallback: "Select"))
                .font(.footnote)
                .foregroundColor(Color.gray)
            Image(systemName: __designTimeString("#6541.[9].[1].property.[0].[1].arg[0].value.[3].arg[0].value", fallback: "calendar.badge.plus"))
                .resizable()
                .scaledToFit()
                .foregroundColor(.gray)
                .frame(width: __designTimeInteger("#6541.[9].[1].property.[0].[1].arg[0].value.[3].modifier[3].arg[0].value", fallback: 40), height: __designTimeInteger("#6541.[9].[1].property.[0].[1].arg[0].value.[3].modifier[3].arg[1].value", fallback: 30))
        }
            Divider()
                .background(.black)
                .padding(__designTimeInteger("#6541.[9].[1].property.[0].[2].modifier[1].arg[0].value", fallback: 0))
        
        
        Text(__designTimeString("#6541.[9].[1].property.[0].[3].arg[0].value", fallback: "When do you need the job done"))
            .font(.footnote)
            .foregroundColor(Color.gray)
        
#sourceLocation()
    }
}

extension SelectCategory {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 189)
       
        HStack{
            Picker(__designTimeString("#6541.[8].[2].property.[0].[0].arg[0].value.[0].arg[0].value", fallback: "Selected Category"), selection: $category)    {
                ForEach(categories, id: \.self) {
                    Text($0)
                }
            }
                .font(.footnote)
                .foregroundColor(Color.gray)
        }
        
    
#sourceLocation()
    }
}

extension UploadCameraIcon {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 158)
       
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: __designTimeInteger("#6541.[7].[0].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: 1), dash: [__designTimeInteger("#6541.[7].[0].property.[0].[0].modifier[0].arg[0].value.arg[1].value.[0]", fallback: 3)]))
            .foregroundColor(.gray)
            .frame(width: __designTimeInteger("#6541.[7].[0].property.[0].[0].modifier[2].arg[0].value", fallback: 72), height: __designTimeInteger("#6541.[7].[0].property.[0].[0].modifier[2].arg[1].value", fallback: 52))
            .padding(__designTimeInteger("#6541.[7].[0].property.[0].[0].modifier[3].arg[0].value", fallback: 5))
            .overlay(
                Image(systemName: __designTimeString("#6541.[7].[0].property.[0].[0].modifier[4].arg[0].value.arg[0].value", fallback: "video.badge.plus"))
                    .resizable()
                    .scaledToFit()
                    .foregroundColor(.gray)
                    .frame(width: __designTimeInteger("#6541.[7].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[0].value", fallback: 22), height: __designTimeInteger("#6541.[7].[0].property.[0].[0].modifier[4].arg[0].value.modifier[3].arg[1].value", fallback: 22))
                    
            )
        
    
#sourceLocation()
    }
}

extension UploadPictureIcon {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 128)
       
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: __designTimeInteger("#6541.[6].[1].property.[0].[0].modifier[0].arg[0].value.arg[0].value", fallback: 1), dash: [__designTimeInteger("#6541.[6].[1].property.[0].[0].modifier[0].arg[0].value.arg[1].value.[0]", fallback: 3)]))
            .foregroundColor(.gray)
            .frame(width: __designTimeInteger("#6541.[6].[1].property.[0].[0].modifier[2].arg[0].value", fallback: 52), height: __designTimeInteger("#6541.[6].[1].property.[0].[0].modifier[2].arg[1].value", fallback: 52))
            .padding(__designTimeInteger("#6541.[6].[1].property.[0].[0].modifier[3].arg[0].value", fallback: 5))
            .overlay(
                VStack{
                    if let image = self.createimage {
                        Image(uiImage: image)
                            .resizable()
                            .scaledToFill()
                            .foregroundColor(.gray)
                            .frame(width: __designTimeInteger("#6541.[6].[1].property.[0].[0].modifier[4].arg[0].value.arg[0].value.[0].[0].[0].modifier[3].arg[0].value", fallback: 22), height: __designTimeInteger("#6541.[6].[1].property.[0].[0].modifier[4].arg[0].value.arg[0].value.[0].[0].[0].modifier[3].arg[1].value", fallback: 22))
                    } else {
                        Image(systemName: __designTimeString("#6541.[6].[1].property.[0].[0].modifier[4].arg[0].value.arg[0].value.[0].[1].[0].arg[0].value", fallback: "camera"))
                            .resizable()
                            .scaledToFit()
                            .foregroundColor(.gray)
                            .frame(width: __designTimeInteger("#6541.[6].[1].property.[0].[0].modifier[4].arg[0].value.arg[0].value.[0].[1].[0].modifier[3].arg[0].value", fallback: 22), height: __designTimeInteger("#6541.[6].[1].property.[0].[0].modifier[4].arg[0].value.arg[0].value.[0].[1].[0].modifier[3].arg[1].value", fallback: 22))
                    }
                }
                )
        
    
#sourceLocation()
    }
}

extension CreateJobView {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/Matt/CreateJobView.swift", line: 25)
        VStack(alignment: .leading){
            HStack(spacing: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[0].arg[0].value", fallback: 30)){
                Image(systemName: __designTimeString("#6541.[5].[9].property.[0].[0].arg[1].value.[0].arg[1].value.[0].arg[0].value", fallback: "xmark"))
                    .resizable()
                    .frame(width: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[0].value", fallback: 25), height: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[0].arg[1].value.[0].modifier[1].arg[1].value", fallback: 25))
                    .scaledToFit()
                
                
                Text(__designTimeString("#6541.[5].[9].property.[0].[0].arg[1].value.[0].arg[1].value.[1].arg[0].value", fallback: "Create a job"))
                    .font(.title)
                    .fontWeight(.bold)
                
                
            }.frame(width: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[0].modifier[0].arg[0].value", fallback: 321), height: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[0].modifier[0].arg[1].value", fallback: 24), alignment: .leading)
                .padding(.horizontal, __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[0].modifier[1].arg[1].value", fallback: 20))
            
            
            Divider()
                .background(.black)
                .shadow(color: .black, radius: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[1].modifier[1].arg[1].value", fallback: 4), x: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[1].modifier[1].arg[2].value", fallback: 0), y: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[1].modifier[1].arg[3].value", fallback: 0))
                .opacity(__designTimeFloat("#6541.[5].[9].property.[0].[0].arg[1].value.[1].modifier[2].arg[0].value", fallback: 0.5))
                .frame(height: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[1].modifier[3].arg[0].value", fallback: 20), alignment: .bottom)
            
            
            
            ScrollView(.vertical){
                VStack(alignment: .leading, spacing: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[1].value", fallback: 10)){
                    
                    
                    HStack{
                        Button {
                            createjobshouldShowImagePicker.toggle()
                        } label: {
                            UploadPictureIcon(createimage: $createimage)
                        }
                            UploadCameraIcon()
                        }.padding(.vertical, __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[0].modifier[0].arg[1].value", fallback: 10))
                        //Job Name
                        Text(__designTimeString("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[1].arg[0].value", fallback: "Job name"))
                            .font(.title)
                            .fontWeight(.bold)
                        VStack (alignment: .leading, spacing: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[1].value", fallback: 10)){
                            TextField(
                                __designTimeString("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[0].arg[0].value", fallback: "e.g Sink Install"),
                                text: $jobTitle)
                            Divider()
                                .background(.black)
                                .padding(__designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[1].modifier[1].arg[0].value", fallback: 0))
                            Text(__designTimeString("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[2].arg[0].value", fallback: "A short job name helps tradies and the like easily identify and respond to your job"))
                                .font(.footnote)
                                .foregroundColor(Color.gray)
                            
                            
                            //Description
                            Text(__designTimeString("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[3].arg[0].value", fallback: "Description"))
                                .font(.title)
                                .fontWeight(.bold)
                                .padding(.top, __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[3].modifier[2].arg[1].value", fallback: 10))
                            
                            
                            TextEditor(text: $jobDesc)
                                .foregroundColor(Color.black)
                                .frame(height: __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[1].arg[0].value", fallback: 200))
                                .overlay(Rectangle()
                                    .stroke(Color.secondary).opacity(__designTimeFloat("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].arg[2].value.[2].arg[2].value.[4].modifier[2].arg[0].value.modifier[1].arg[0].value", fallback: 0.5)))
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
                        
                        
                    } .padding(.horizontal, __designTimeInteger("#6541.[5].[9].property.[0].[0].arg[1].value.[2].arg[1].value.[0].modifier[0].arg[1].value", fallback: 20))
                    
                }
            }
        .padding(.bottom, __designTimeInteger("#6541.[5].[9].property.[0].[0].modifier[0].arg[1].value", fallback: 60))
        .fullScreenCover(isPresented: $createjobshouldShowImagePicker, onDismiss: nil) {
            ImagePicker(image1: $createimage, JobName: $jobTitle)
                .ignoresSafeArea()
            
        }
        
#sourceLocation()
    }
}

import struct Trade_Marketplace.CreateJobView
import struct Trade_Marketplace.UploadPictureIcon
import struct Trade_Marketplace.UploadCameraIcon
import struct Trade_Marketplace.SelectCategory
import struct Trade_Marketplace.When
import struct Trade_Marketplace.Details
import struct Trade_Marketplace.Description
import struct Trade_Marketplace.Where
import struct Trade_Marketplace.Tags
import struct Trade_Marketplace.Publish
import struct Trade_Marketplace.CreateJobView_Previews
import struct Trade_Marketplace.SubmitJob
import class Trade_Marketplace.UploadJob
import struct Trade_Marketplace.ImagePicker
