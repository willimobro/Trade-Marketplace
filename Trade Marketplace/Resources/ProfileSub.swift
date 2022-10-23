//
//  ProfileSub.swift
//  Trade Marketplace
//
//  Created by William larsen on 21/09/22.
//

import SwiftUI

struct ProfileSub: View {
    @StateObject private var vm = ServerControl()
    var body: some View {
        HStack{
            Circle()
                .foregroundColor(Color("Homebackgroundgreen"))
                .frame(width: 55, height: 55)
                .overlay(Text("J"))
                    .frame(width: 27, height: 40)
                    .foregroundColor(.white)
                    .font(.custom("Poppins-SemiBold", size: 28))
                    .padding(20)
            VStack{
                Text("servercontrol.text")
                    .font(.custom("Poppins-SemiBold", size: 28))
                    .frame(width: 300, alignment: .leading)
                    

                Text("Residence")
                    .font(.custom("Poppins-SemiBold", size: 14))
                    .frame(width: 300, alignment: .leading)
                    .foregroundColor(.gray)
                HStack(spacing: 1){
                    Image(systemName: "star.fill")
                    Image(systemName: "star.fill")
                    Image(systemName: "star.fill")
                    Image(systemName: "star.fill")
                    Image(systemName: "star")
                }
                .frame(width: 300, alignment: .leading)
                .foregroundColor(Color("logogreen"))
                
            }
        }.frame(width: 359, alignment: .center)
    }
}

struct ProfileSub_Previews: PreviewProvider {
    static var previews: some View {
        ProfileSub()
    }
}
