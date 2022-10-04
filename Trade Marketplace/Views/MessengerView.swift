//
//  MessengerView.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct MessengerView: View {
    var body: some View {
        VStack (spacing:20){
            CategoryNavigator(category: "Messages")
            ScrollView(.vertical){
            SearchViaCategory(category: "Messages")
                .accentColor(.green)
            ProfileViewMessager(Firstname: "John", Lastname: "Andrew")
            ProfileViewMessager(Firstname: "Troy", Lastname: "Dennis")
            ProfileViewMessager(Firstname: "Andrew", Lastname: "Tate")
            ProfileViewMessager(Firstname: "Spark Electrical", Lastname: "LTD")
            }
            
        }.ignoresSafeArea()
    }
}

struct MessengerView_Previews: PreviewProvider {
    static var previews: some View {
        MessengerView()
    }
}


struct ProfileViewMessager: View {
    @State var Firstname = ""
    @State var Lastname = ""
    
    var body: some View {
        RoundedRectangle(cornerRadius: 15)
            .fill(.white)
            .frame(height: 100, alignment: .leading)
            .padding(.horizontal, 16)
            .padding(.vertical, 6)
            .shadow(color: .gray, radius: 4, x: 0, y: 0)
            .overlay(HStack{
                Circle()
                    .foregroundColor(Color("Homebackgroundgreen"))
                    .scaledToFit()
                    .frame(width: 80, height: 80)
                    .overlay(
                    Image("greenvan")
                        .resizable()
                        .scaledToFit())
                VStack (alignment: .leading){
                    Text("\(Firstname) \(Lastname)")
                        .font(.custom("Poppins-SemiBold", size: 20))
                    Spacer()
                    Text("I know you dont like sparkling water")
                        .lineLimit(1)
                        
                }.frame(height: 50)
                   
            }.frame(width: 321, alignment: .leading)
            )
    }
}
