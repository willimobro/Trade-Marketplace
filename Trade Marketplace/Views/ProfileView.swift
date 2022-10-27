//
//  ProfileView.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var data: downloadprofileviewdata
    var body: some View {
        VStack {
            CategoryNavigator(category: "Profile")
            ProfileViewDescription()
            ReviewTab()
            Spacer()
        }.ignoresSafeArea()
    }
}
    
struct ProfileViewDescription: View {
    @State var shouldShowImagePicker = false
    @State var image: UIImage?
    
    @EnvironmentObject var data: downloadprofileviewdata
    var body: some View {
        HStack(spacing: 40){
            Button {
                shouldShowImagePicker.toggle()
            } label: {
                AsyncImage(url: URL(string: data.image!)) { image in
                    image
                        .resizable()
                        .frame(width: 76, height: 76)
                        .scaledToFit()
                        .cornerRadius(96)
                } placeholder: {
                    Image(systemName: "person.fill")
                        .resizable()
                        .frame(width: 76, height: 76)
                        .scaledToFit()
                        .cornerRadius(76)
                        .foregroundColor(Color(.label))
                }
                
            }.overlay(
                RoundedRectangle(cornerRadius: 96).stroke(Color.black, lineWidth: 3)
            )
            VStack (alignment: .leading, spacing: 0){
                Text(data.firstname + " " +  data.lastname)
                    .font(.custom("Poppins-SemiBold", size: 20))
                Text(data.location)
                    .foregroundColor(.gray)
                Text(data.username)
                    .foregroundColor(.gray)
            }
        }
        .padding(.horizontal, 20)
        .onAppear { self.data.DownloadProfileViewData()
        }
        .fullScreenCover(isPresented: $shouldShowImagePicker, onDismiss: nil) {
            ServerControl.ImagePicker(image: $image)
                .ignoresSafeArea()
            
        }
    }
}
    
    struct ReviewTab: View {
        @State  var profilemenu = String()
        @EnvironmentObject var data: downloadprofileviewdata
        var body: some View {
            VStack{
                HStack {
                    HStack{
                        Image(systemName: "star.fill")
                        Image(systemName: "star.fill")
                        Image(systemName: "star.fill")
                        Image(systemName: "star.leadinghalf.filled")
                        Image(systemName: "star")
                    }.foregroundColor(.green)
                        .frame(width: 150)
                    Spacer()
                    Text("\(data.reviews) Reviews")
                        .font(.custom("Poppins-SemiBold", size: 20))
                }.padding(.horizontal, 20)
                Divider()
                    .background(.black)
                HStack{
                    Picker("Quoted", selection: $profilemenu) {
                        Text("Quoted")
                    }
                    Picker("Reviews", selection: $profilemenu) {
                        Text("Reviews")
                    }
                    Picker("Jobs", selection: $profilemenu) {
                        Text("Jobs")
                    }
                }.pickerStyle(.segmented)
                    .padding(.horizontal, 20)
                ScrollView(.vertical){
                    HStack(spacing: 60){
                        VStack{
                            Quote()
                            Quote()
                            Quote()
                            Quote()
                        }
                        VStack{
                            Quote()
                            Quote()
                            Quote()
                            Quote()
                        }
                    }.padding(.horizontal, 26)
                }
                
            }
        }
    }
    
    
    struct ProfileView_Previews: PreviewProvider {
        @EnvironmentObject var data: downloadprofileviewdata
        @Binding var shouldShowImagePicker: Bool
        @Binding var image: UIImage?
        static var previews: some View {
            ProfileView()
        }
    }


